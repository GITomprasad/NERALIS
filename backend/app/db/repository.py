"""
NERALIS Central Repository & Data Access Layer.
Implements the hybrid Supabase (Cloud Truth) + SQLite (Operational Cache) routing logic.
"""

import datetime
import uuid
import logging
from typing import Dict, List, Any, Optional, Tuple

from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.supabase_client import supabase_client
from app.db.sqlite_cache import sqlite_cache_manager
from app.db.models import (
    RoadSegmentModel,
    BridgeModel,
    VehicleModel,
    DisasterAlertModel,
    FieldReportModel,
    DistrictModel,
    StateModel,
    SupplyDepotModel,
    SourceRegistryModel,
    SyncQueueModel,
    PredictionCacheModel,
    SystemMetadataModel,
    UserModel
)

logger = logging.getLogger("neralis.repository")

class NeralisRepository:
    def __init__(self):
        self.supabase = supabase_client
        self.sqlite = sqlite_cache_manager

    # ── Storage State & Liveness ───────────────────────────────────────────────

    def get_connectivity_status(self) -> Dict[str, Any]:
        """
        Determines active database connectivity and returns storage status.
        """
        is_cloud_available = self.supabase.is_reachable()
        mode = "LIVE" if is_cloud_available else "OFFLINE"
        
        # Check pending sync queue count in SQLite
        pending_sync_count = 0
        cache_db: Session = self.sqlite.get_session()
        try:
            pending_sync_count = cache_db.query(SyncQueueModel).filter(
                SyncQueueModel.sync_status == "PENDING"
            ).count()
        except Exception:
            pass
        finally:
            cache_db.close()

        return {
            "connectivity": "online" if is_cloud_available else "offline",
            "active_database": "supabase_postgresql" if is_cloud_available else "sqlite_cache",
            "cache_layer": "sqlite_operational_cache",
            "storage_state": mode,
            "simulation_offline_mode": settings.OFFLINE_SIMULATION_MODE,
            "pending_offline_changes": pending_sync_count,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }

    def set_simulation_offline_mode(self, enabled: bool):
        """Allows toggling offline demonstration mode at runtime."""
        settings.OFFLINE_SIMULATION_MODE = enabled
        logger.info(f"Offline simulation mode set to: {enabled}")

    # ── Helper Execution Decorator ─────────────────────────────────────────────

    def _execute_read(self, model_class, query_filter=None) -> Tuple[List[Any], str]:
        """
        Attempts to read from Supabase; falls back to SQLite cache if unreachable.
        Returns (records_dict_list, 'LIVE' | 'CACHED').
        """
        # 1. Try Supabase Cloud if online
        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    q = cloud_db.query(model_class)
                    if query_filter:
                        q = query_filter(q)
                    items = q.all()
                    
                    # Convert to dicts for clean layer decoupling
                    results = [self._model_to_dict(i) for i in items]
                    
                    # Opportunistically update SQLite cache in background/sync
                    self._update_sqlite_cache_batch(model_class, results)
                    
                    return results, "LIVE"
                except Exception as e:
                    logger.warning(f"Supabase read error for {model_class.__tablename__}, falling back to SQLite: {e}")
                finally:
                    cloud_db.close()

        # 2. Offline / Fallback: Read from Local SQLite Cache
        cache_db = self.sqlite.get_session()
        try:
            q = cache_db.query(model_class)
            if query_filter:
                q = query_filter(q)
            items = q.all()
            results = [self._model_to_dict(i) for i in items]
            return results, "CACHED"
        except Exception as e:
            logger.error(f"SQLite cache read error for {model_class.__tablename__}: {e}")
            return [], "OFFLINE_ERROR"
        finally:
            cache_db.close()

    def _model_to_dict(self, obj) -> Dict[str, Any]:
        """Converts a SQLAlchemy model instance into a dictionary."""
        if not obj:
            return {}
        d = {}
        for column in obj.__table__.columns:
            val = getattr(obj, column.name)
            if isinstance(val, (datetime.datetime, datetime.date)):
                val = val.isoformat()
            d[column.name] = val
        return d

    def _update_sqlite_cache_batch(self, model_class, dict_items: List[Dict[str, Any]]):
        """Refreshes the local SQLite cache table with authoritative cloud items."""
        if not dict_items:
            return
        cache_db = self.sqlite.get_session()
        try:
            for item in dict_items:
                existing = cache_db.query(model_class).filter_by(id=item["id"]).first()
                if existing:
                    for k, v in item.items():
                        if hasattr(existing, k) and k not in ["created_at"]:
                            setattr(existing, k, v)
                else:
                    cache_db.add(model_class(**item))
            cache_db.commit()
        except Exception as e:
            cache_db.rollback()
            logger.debug(f"Cache sync error for {model_class.__tablename__}: {e}")
        finally:
            cache_db.close()

    # ── Corridors ──────────────────────────────────────────────────────────────

    def get_corridors(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(RoadSegmentModel)

    def update_corridor_status(self, corridor_id: str, status: str, hazard_type: Optional[str] = None, risk_score: Optional[int] = None) -> Dict[str, Any]:
        update_data = {"status": status}
        if hazard_type:
            update_data["hazard_type"] = hazard_type
        if risk_score is not None:
            update_data["risk_score"] = risk_score

        # 1. Update in SQLite Cache first
        cache_db = self.sqlite.get_session()
        try:
            seg = cache_db.query(RoadSegmentModel).filter(RoadSegmentModel.id == corridor_id).first()
            if seg:
                seg.status = status
                if hazard_type:
                    seg.hazard_type = hazard_type
                if risk_score is not None:
                    seg.risk_score = risk_score
                cache_db.commit()
        except Exception as e:
            cache_db.rollback()
            logger.error(f"Error updating SQLite corridor cache: {e}")
        finally:
            cache_db.close()

        # 2. Try Supabase Cloud write
        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    cloud_seg = cloud_db.query(RoadSegmentModel).filter(RoadSegmentModel.id == corridor_id).first()
                    if cloud_seg:
                        cloud_seg.status = status
                        if hazard_type:
                            cloud_seg.hazard_type = hazard_type
                        if risk_score is not None:
                            cloud_seg.risk_score = risk_score
                        cloud_db.commit()
                        return {"status": "SUCCESS", "storage_mode": "LIVE_SUPABASE", "corridor_id": corridor_id}
                except Exception as e:
                    cloud_db.rollback()
                    logger.warning(f"Supabase update failed, enqueuing offline change: {e}")
                finally:
                    cloud_db.close()

        # 3. Enqueue to Offline Sync Queue
        self._enqueue_offline_operation(
            entity_type="CORRIDOR",
            entity_id=corridor_id,
            operation_type="UPDATE",
            payload=update_data
        )
        return {"status": "SUCCESS", "storage_mode": "QUEUED_OFFLINE", "corridor_id": corridor_id}

    # ── Bridges ────────────────────────────────────────────────────────────────

    def get_bridges(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(BridgeModel)

    def update_bridge_status(self, bridge_id: str, status: str, structural_health_pct: Optional[int] = None) -> Dict[str, Any]:
        update_data = {"status": status}
        if structural_health_pct is not None:
            update_data["structural_health_pct"] = structural_health_pct

        cache_db = self.sqlite.get_session()
        try:
            br = cache_db.query(BridgeModel).filter(BridgeModel.id == bridge_id).first()
            if br:
                br.status = status
                if structural_health_pct is not None:
                    br.structural_health_pct = structural_health_pct
                cache_db.commit()
        finally:
            cache_db.close()

        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    cloud_br = cloud_db.query(BridgeModel).filter(BridgeModel.id == bridge_id).first()
                    if cloud_br:
                        cloud_br.status = status
                        if structural_health_pct is not None:
                            cloud_br.structural_health_pct = structural_health_pct
                        cloud_db.commit()
                        return {"status": "SUCCESS", "storage_mode": "LIVE_SUPABASE", "bridge_id": bridge_id}
                except Exception:
                    cloud_db.rollback()
                finally:
                    cloud_db.close()

        self._enqueue_offline_operation(
            entity_type="BRIDGE",
            entity_id=bridge_id,
            operation_type="UPDATE",
            payload=update_data
        )
        return {"status": "SUCCESS", "storage_mode": "QUEUED_OFFLINE", "bridge_id": bridge_id}

    # ── Vehicles & Fleet ───────────────────────────────────────────────────────

    def get_vehicles(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(VehicleModel)

    def dispatch_vehicle(self, vehicle_id: str, dispatch_payload: Dict[str, Any]) -> Dict[str, Any]:
        cache_db = self.sqlite.get_session()
        try:
            v = cache_db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
            if v:
                v.status = "IN_TRANSIT"
                v.origin = dispatch_payload.get("origin", v.origin)
                v.destination = dispatch_payload.get("destination", v.destination)
                v.cargo_type = dispatch_payload.get("cargo_type", v.cargo_type)
                v.cargo_weight_tons = dispatch_payload.get("vehicle_weight_tons", v.cargo_weight_tons)
                cache_db.commit()
        finally:
            cache_db.close()

        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    cloud_v = cloud_db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
                    if cloud_v:
                        cloud_v.status = "IN_TRANSIT"
                        cloud_v.origin = dispatch_payload.get("origin", cloud_v.origin)
                        cloud_v.destination = dispatch_payload.get("destination", cloud_v.destination)
                        cloud_v.cargo_type = dispatch_payload.get("cargo_type", cloud_v.cargo_type)
                        cloud_v.cargo_weight_tons = dispatch_payload.get("vehicle_weight_tons", cloud_v.cargo_weight_tons)
                        cloud_db.commit()
                        return {"status": "DISPATCHED", "storage_mode": "LIVE_SUPABASE", "vehicle_id": vehicle_id}
                except Exception:
                    cloud_db.rollback()
                finally:
                    cloud_db.close()

        self._enqueue_offline_operation(
            entity_type="VEHICLE",
            entity_id=vehicle_id,
            operation_type="DISPATCH",
            payload=dispatch_payload
        )
        return {"status": "DISPATCHED", "storage_mode": "QUEUED_OFFLINE", "vehicle_id": vehicle_id}

    # ── Alerts ─────────────────────────────────────────────────────────────────

    def get_alerts(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(DisasterAlertModel)

    def create_alert(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        alert_id = alert_data.get("id") or f"ALT-NER-{uuid.uuid4().hex[:6].upper()}"
        alert_data["id"] = alert_id

        cache_db = self.sqlite.get_session()
        try:
            cache_db.add(DisasterAlertModel(**alert_data))
            cache_db.commit()
        finally:
            cache_db.close()

        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    cloud_db.add(DisasterAlertModel(**alert_data))
                    cloud_db.commit()
                    return {"status": "CREATED", "storage_mode": "LIVE_SUPABASE", "alert": alert_data}
                except Exception:
                    cloud_db.rollback()
                finally:
                    cloud_db.close()

        self._enqueue_offline_operation(
            entity_type="ALERT",
            entity_id=alert_id,
            operation_type="INSERT",
            payload=alert_data
        )
        return {"status": "CREATED", "storage_mode": "QUEUED_OFFLINE", "alert": alert_data}

    def acknowledge_alert(self, alert_id: str, acknowledged_by: str = "Operator") -> Dict[str, Any]:
        cache_db = self.sqlite.get_session()
        try:
            alt = cache_db.query(DisasterAlertModel).filter(DisasterAlertModel.id == alert_id).first()
            if alt:
                alt.acknowledged = True
                alt.acknowledged_by = acknowledged_by
                alt.verification_status = "ACKNOWLEDGED"
                cache_db.commit()
        finally:
            cache_db.close()

        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    cloud_alt = cloud_db.query(DisasterAlertModel).filter(DisasterAlertModel.id == alert_id).first()
                    if cloud_alt:
                        cloud_alt.acknowledged = True
                        cloud_alt.acknowledged_by = acknowledged_by
                        cloud_alt.verification_status = "ACKNOWLEDGED"
                        cloud_db.commit()
                        return {"status": "SUCCESS", "storage_mode": "LIVE_SUPABASE", "alert_id": alert_id}
                except Exception:
                    cloud_db.rollback()
                finally:
                    cloud_db.close()

        self._enqueue_offline_operation(
            entity_type="ALERT",
            entity_id=alert_id,
            operation_type="ACKNOWLEDGE",
            payload={"acknowledged_by": acknowledged_by}
        )
        return {"status": "SUCCESS", "storage_mode": "QUEUED_OFFLINE", "alert_id": alert_id}

    # ── Field Reports ──────────────────────────────────────────────────────────

    def get_field_reports(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(FieldReportModel)

    def submit_field_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        rep_id = report_data.get("id") or f"REP-{uuid.uuid4().hex[:8].upper()}"
        report_data["id"] = rep_id
        if "timestamp" not in report_data:
            report_data["timestamp"] = datetime.datetime.now().isoformat()

        # Filter fields matching model
        valid_cols = {c.name for c in FieldReportModel.__table__.columns}
        filtered_data = {k: v for k, v in report_data.items() if k in valid_cols}

        cache_db = self.sqlite.get_session()
        try:
            existing = None
            if filtered_data.get("client_event_id"):
                existing = cache_db.query(FieldReportModel).filter(FieldReportModel.client_event_id == filtered_data["client_event_id"]).first()
            if not existing:
                existing = cache_db.query(FieldReportModel).filter(FieldReportModel.id == rep_id).first()

            if existing:
                for k, v in filtered_data.items():
                    setattr(existing, k, v)
            else:
                cache_db.add(FieldReportModel(**filtered_data))
            cache_db.commit()
        except Exception as e:
            cache_db.rollback()
            logger.warning(f"Error persisting field report to SQLite: {e}")
        finally:
            cache_db.close()

        if self.supabase.is_reachable():
            cloud_db = self.supabase.get_session()
            if cloud_db:
                try:
                    existing_cloud = None
                    if filtered_data.get("client_event_id"):
                        existing_cloud = cloud_db.query(FieldReportModel).filter(FieldReportModel.client_event_id == filtered_data["client_event_id"]).first()
                    if not existing_cloud:
                        existing_cloud = cloud_db.query(FieldReportModel).filter(FieldReportModel.id == rep_id).first()

                    if existing_cloud:
                        for k, v in filtered_data.items():
                            setattr(existing_cloud, k, v)
                    else:
                        cloud_db.add(FieldReportModel(**filtered_data))
                    cloud_db.commit()
                    return {"status": "SUBMITTED", "storage_mode": "LIVE_SUPABASE", "report": report_data}
                except Exception:
                    cloud_db.rollback()
                finally:
                    cloud_db.close()

        self._enqueue_offline_operation(
            entity_type="FIELD_REPORT",
            entity_id=rep_id,
            operation_type="INSERT",
            payload=report_data
        )
        return {"status": "SUBMITTED", "storage_mode": "QUEUED_OFFLINE", "report": report_data}

    # ── Geography & Sources ────────────────────────────────────────────────────

    def get_districts(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(DistrictModel)

    def get_states(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(StateModel)

    def get_depots(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(SupplyDepotModel)

    def get_sources(self) -> Tuple[List[Dict[str, Any]], str]:
        return self._execute_read(SourceRegistryModel)

    # ── ML Predictions Cache ───────────────────────────────────────────────────

    def cache_prediction(self, horizon_hours: int, forecast_data: Dict[str, Any]):
        """Persists the latest ML forecast in SQLite so it is accessible offline."""
        cache_db = self.sqlite.get_session()
        try:
            cache_id = f"FORECAST_{horizon_hours}H"
            existing = cache_db.query(PredictionCacheModel).filter(PredictionCacheModel.id == cache_id).first()
            if existing:
                existing.data = forecast_data
                existing.cached_at = datetime.datetime.utcnow()
            else:
                cache_db.add(PredictionCacheModel(
                    id=cache_id,
                    forecast_horizon_hours=horizon_hours,
                    data=forecast_data,
                    model_version=forecast_data.get("model_metadata", {}).get("model_version", "NERALIS-RF-NER-Landslide-v1.0")
                ))
            cache_db.commit()
        except Exception as e:
            cache_db.rollback()
            logger.debug(f"Error caching prediction forecast: {e}")
        finally:
            cache_db.close()

    def get_cached_prediction(self, horizon_hours: int) -> Optional[Dict[str, Any]]:
        """Retrieves the latest ML forecast from SQLite cache if available."""
        cache_db = self.sqlite.get_session()
        try:
            cache_id = f"FORECAST_{horizon_hours}H"
            item = cache_db.query(PredictionCacheModel).filter(PredictionCacheModel.id == cache_id).first()
            if item and item.data:
                return item.data
        finally:
            cache_db.close()
        return None

    # ── Offline Queue Management ───────────────────────────────────────────────

    def _enqueue_offline_operation(self, entity_type: str, entity_id: str, operation_type: str, payload: Dict[str, Any]):
        """Records an operation in SQLite sync_queue table for later cloud upload."""
        cache_db = self.sqlite.get_session()
        try:
            op_id = f"SYNC-{uuid.uuid4().hex[:12]}"
            queue_item = SyncQueueModel(
                id=op_id,
                entity_type=entity_type,
                entity_id=entity_id,
                operation_type=operation_type,
                payload=payload,
                created_at=datetime.datetime.utcnow(),
                sync_status="PENDING",
                retry_count=0
            )
            cache_db.add(queue_item)
            cache_db.commit()
            logger.info(f"Enqueued offline operation {op_id} for {entity_type} {entity_id}")
        except Exception as e:
            cache_db.rollback()
            logger.error(f"Failed to enqueue offline operation: {e}")
        finally:
            cache_db.close()

repository = NeralisRepository()
