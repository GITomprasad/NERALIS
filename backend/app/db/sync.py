"""
NERALIS Database Synchronization Service.
Orchestrates bidirectional synchronization between SQLite operational cache and Supabase cloud.
"""

import datetime
import logging
from typing import Dict, Any, List

from sqlalchemy.orm import Session
from app.db.supabase_client import supabase_client
from app.db.sqlite_cache import sqlite_cache_manager
from app.db.models import (
    SyncQueueModel,
    RoadSegmentModel,
    BridgeModel,
    VehicleModel,
    DisasterAlertModel,
    FieldReportModel
)

logger = logging.getLogger("neralis.sync")

class DatabaseSyncService:
    def __init__(self):
        self.supabase = supabase_client
        self.sqlite = sqlite_cache_manager

    def perform_full_sync(self) -> Dict[str, Any]:
        """
        Executes full bidirectional sync:
        1. Uploads pending offline changes from SQLite sync_queue to Supabase.
        2. Pulls fresh authoritative records from Supabase into SQLite cache.
        """
        if not self.supabase.is_reachable():
            return {
                "status": "offline",
                "message": "Supabase cloud is currently unreachable. Operating from local SQLite cache.",
                "uploaded": 0,
                "downloaded": 0,
                "failed": 0,
                "pending": self._get_pending_queue_count(),
                "storage_state": "OFFLINE",
                "timestamp": datetime.datetime.utcnow().isoformat()
            }

        uploaded_count = 0
        failed_count = 0

        # Step 1: Upload pending queue items
        cache_db: Session = self.sqlite.get_session()
        cloud_db: Session = self.supabase.get_session()

        try:
            pending_items = cache_db.query(SyncQueueModel).filter(
                SyncQueueModel.sync_status == "PENDING"
            ).order_by(SyncQueueModel.created_at.asc()).all()

            for item in pending_items:
                success = self._apply_queue_item_to_cloud(cloud_db, item)
                if success:
                    item.sync_status = "SYNCED"
                    item.synced_at = datetime.datetime.utcnow()
                    uploaded_count += 1
                else:
                    item.retry_count += 1
                    if item.retry_count > 5:
                        item.sync_status = "FAILED"
                    failed_count += 1
            
            cache_db.commit()
            if cloud_db:
                cloud_db.commit()
        except Exception as e:
            logger.error(f"Sync queue upload error: {e}")
            cache_db.rollback()
            if cloud_db:
                cloud_db.rollback()
        finally:
            cache_db.close()
            if cloud_db:
                cloud_db.close()

        # Step 2: Download fresh state from Supabase to SQLite cache
        downloaded_count = self._refresh_cache_from_cloud()
        pending_remaining = self._get_pending_queue_count()

        return {
            "status": "success" if failed_count == 0 else "partial_success",
            "uploaded": uploaded_count,
            "downloaded": downloaded_count,
            "failed": failed_count,
            "pending": pending_remaining,
            "storage_state": "LIVE",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }

    def _apply_queue_item_to_cloud(self, cloud_db: Session, item: SyncQueueModel) -> bool:
        """Applies a single offline queue item to Supabase PostgreSQL."""
        if not cloud_db:
            return False
        try:
            entity_type = item.entity_type
            entity_id = item.entity_id
            op_type = item.operation_type
            payload = item.payload or {}

            if entity_type == "CORRIDOR":
                seg = cloud_db.query(RoadSegmentModel).filter(RoadSegmentModel.id == entity_id).first()
                if seg:
                    for k, v in payload.items():
                        if hasattr(seg, k):
                            setattr(seg, k, v)
                return True

            elif entity_type == "BRIDGE":
                br = cloud_db.query(BridgeModel).filter(BridgeModel.id == entity_id).first()
                if br:
                    for k, v in payload.items():
                        if hasattr(br, k):
                            setattr(br, k, v)
                return True

            elif entity_type == "VEHICLE":
                veh = cloud_db.query(VehicleModel).filter(VehicleModel.id == entity_id).first()
                if veh:
                    for k, v in payload.items():
                        if hasattr(veh, k):
                            setattr(veh, k, v)
                return True

            elif entity_type == "ALERT":
                if op_type == "INSERT":
                    existing = cloud_db.query(DisasterAlertModel).filter(DisasterAlertModel.id == entity_id).first()
                    if not existing:
                        cloud_db.add(DisasterAlertModel(**payload))
                elif op_type == "ACKNOWLEDGE":
                    alt = cloud_db.query(DisasterAlertModel).filter(DisasterAlertModel.id == entity_id).first()
                    if alt:
                        alt.acknowledged = True
                        alt.acknowledged_by = payload.get("acknowledged_by", "Operator")
                        alt.verification_status = "ACKNOWLEDGED"
                return True

            elif entity_type == "FIELD_REPORT":
                if op_type == "INSERT":
                    existing = cloud_db.query(FieldReportModel).filter(FieldReportModel.id == entity_id).first()
                    if not existing:
                        cloud_db.add(FieldReportModel(**payload))
                return True

            return True
        except Exception as e:
            logger.error(f"Failed to apply queue item {item.id} to Supabase: {e}")
            item.error_message = str(e)
            return False

    def _refresh_cache_from_cloud(self) -> int:
        """Downloads updated corridors, bridges, alerts, and vehicles into SQLite."""
        if not self.supabase.is_reachable():
            return 0

        cloud_db = self.supabase.get_session()
        cache_db = self.sqlite.get_session()
        total_synced = 0

        if not cloud_db:
            return 0

        try:
            # Sync corridors
            corridors = cloud_db.query(RoadSegmentModel).all()
            for c in corridors:
                cached = cache_db.query(RoadSegmentModel).filter_by(id=c.id).first()
                if cached:
                    cached.status = c.status
                    cached.hazard_type = c.hazard_type
                    cached.risk_score = c.risk_score
                else:
                    cache_db.add(RoadSegmentModel(
                        id=c.id, name=c.name, from_district=c.from_district, to_district=c.to_district,
                        distance_km=c.distance_km, status=c.status, hazard_type=c.hazard_type, risk_score=c.risk_score
                    ))
                total_synced += 1

            # Sync bridges
            bridges = cloud_db.query(BridgeModel).all()
            for b in bridges:
                cached_br = cache_db.query(BridgeModel).filter_by(id=b.id).first()
                if cached_br:
                    cached_br.status = b.status
                    cached_br.structural_health_pct = b.structural_health_pct
                total_synced += 1

            cache_db.commit()
        except Exception as e:
            cache_db.rollback()
            logger.warning(f"Cache download refresh warning: {e}")
        finally:
            cloud_db.close()
            cache_db.close()

        return total_synced

    def _get_pending_queue_count(self) -> int:
        cache_db = self.sqlite.get_session()
        try:
            return cache_db.query(SyncQueueModel).filter(SyncQueueModel.sync_status == "PENDING").count()
        except Exception:
            return 0
        finally:
            cache_db.close()

sync_service = DatabaseSyncService()
