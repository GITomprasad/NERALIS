"""
NERALIS Geospatial & Master Infrastructure Endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import StateModel, DistrictModel, RoadSegmentModel, BridgeModel, SupplyDepotModel
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS

router = APIRouter(tags=["Geospatial & Infrastructure"])

@router.get("/states")
def get_states(db: Session = Depends(get_db)):
    try:
        states = db.query(StateModel).all()
        if states:
            return {"states": [s.__dict__ for s in states]}
    except Exception:
        pass
    return {"states": NER_STATES}

@router.get("/districts")
def get_districts(db: Session = Depends(get_db)):
    try:
        districts = db.query(DistrictModel).all()
        if districts:
            return {"districts": [{k: v for k, v in d.__dict__.items() if not k.startswith("_")} for d in districts]}
    except Exception:
        pass
    return {"districts": NER_DISTRICTS}

@router.get("/corridors")
def get_corridors(db: Session = Depends(get_db)):
    try:
        corridors = db.query(RoadSegmentModel).all()
        if corridors:
            return {"corridors": [{k: v for k, v in c.__dict__.items() if not k.startswith("_")} for c in corridors]}
    except Exception:
        pass
    return {"corridors": NER_ROAD_SEGMENTS}

@router.get("/bridges")
def get_bridges(db: Session = Depends(get_db)):
    try:
        bridges = db.query(BridgeModel).all()
        if bridges:
            return {"bridges": [{k: v for k, v in b.__dict__.items() if not k.startswith("_")} for b in bridges]}
    except Exception:
        pass
    return {"bridges": NER_BRIDGES}

@router.get("/depots")
def get_depots(db: Session = Depends(get_db)):
    try:
        depots = db.query(SupplyDepotModel).all()
        if depots:
            return {"depots": [{k: v for k, v in d.__dict__.items() if not k.startswith("_")} for d in depots]}
    except Exception:
        pass
    return {"depots": NER_DEPOTS}
