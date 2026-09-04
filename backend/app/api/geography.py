"""
NERALIS Geospatial & Master Infrastructure Endpoints.
Uses Repository Layer (Supabase Cloud with local SQLite operational cache fallback).
"""

from fastapi import APIRouter
from app.db.repository import repository
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS

router = APIRouter(tags=["Geospatial & Infrastructure"])

@router.get("/states")
def get_states():
    states, mode = repository.get_states()
    return {
        "states": states if states else NER_STATES,
        "storage_mode": mode
    }

@router.get("/districts")
def get_districts():
    districts, mode = repository.get_districts()
    return {
        "districts": districts if districts else NER_DISTRICTS,
        "storage_mode": mode
    }

@router.get("/corridors")
def get_corridors():
    corridors, mode = repository.get_corridors()
    return {
        "corridors": corridors if corridors else NER_ROAD_SEGMENTS,
        "storage_mode": mode
    }

@router.get("/bridges")
def get_bridges():
    bridges, mode = repository.get_bridges()
    return {
        "bridges": bridges if bridges else NER_BRIDGES,
        "storage_mode": mode
    }

@router.get("/depots")
def get_depots():
    depots, mode = repository.get_depots()
    return {
        "depots": depots if depots else NER_DEPOTS,
        "storage_mode": mode
    }
