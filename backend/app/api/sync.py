"""
NERALIS Database Synchronization & Connectivity API Router.
Exposes endpoints for manual/automatic sync, storage state probes, and offline demonstration mode.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, Optional

from app.db.repository import repository
from app.db.sync import sync_service

router = APIRouter(prefix="/sync", tags=["Database Synchronization & Offline Mode"])

class OfflineModeRequest(BaseModel):
    offline_mode: bool

@router.get("/status")
def get_sync_and_storage_status() -> Dict[str, Any]:
    """
    Returns current connectivity, storage tier (Supabase Cloud vs SQLite Cache),
    and count of pending offline changes in queue.
    """
    return repository.get_connectivity_status()

@router.post("")
@router.post("/")
def trigger_synchronization() -> Dict[str, Any]:
    """
    Triggers bidirectional synchronization between SQLite operational cache and Supabase Cloud.
    Uploads queued offline operations and refreshes local state.
    """
    return sync_service.perform_full_sync()

@router.post("/mode")
def set_offline_simulation_mode(req: OfflineModeRequest) -> Dict[str, Any]:
    """
    Demonstration toggle: Simulates internet/cloud disconnect or reconnect.
    When enabled, forces the entire backend to execute exclusively against the local SQLite cache.
    """
    repository.set_simulation_offline_mode(req.offline_mode)
    return {
        "status": "SUCCESS",
        "offline_simulation_active": req.offline_mode,
        "message": "Offline demonstration mode activated. Backend now operates strictly on local SQLite cache." if req.offline_mode else "Online mode restored. Backend will connect to Supabase Cloud when reachable.",
        "storage_status": repository.get_connectivity_status()
    }
