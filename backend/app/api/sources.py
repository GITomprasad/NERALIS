"""
NERALIS Official Data Source Registry Endpoint.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import SourceRegistryModel
from app.data.sources import NER_SOURCE_REGISTRY

router = APIRouter(tags=["Source Registry"])

@router.get("/sources")
def get_sources(db: Session = Depends(get_db)):
    """
    Returns official government data sources with trust scores, update frequencies, and heartbeat status.
    """
    try:
        sources_db = db.query(SourceRegistryModel).all()
        if sources_db:
            return {
                "sources": [
                    {
                        "id": s.id,
                        "name": s.name,
                        "department": s.department,
                        "service": s.service,
                        "update_frequency": s.update_frequency,
                        "status": s.status,
                        "trust_score": s.trust_score,
                        "endpoint_pattern": s.endpoint_pattern,
                        "data_types": s.data_types,
                        "last_heartbeat": s.last_heartbeat,
                        "is_live_connector": s.is_live_connector
                    }
                    for s in sources_db
                ]
            }
    except Exception:
        pass
    return {"sources": NER_SOURCE_REGISTRY}
