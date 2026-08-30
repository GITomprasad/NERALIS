"""
North Eastern Region (NER) Master Geographic & Infrastructure Registry.
Clean re-export facade connecting domain modules:
- sources: NER_SOURCE_REGISTRY
- states: NER_STATES, NER_DISTRICTS
- infrastructure: NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
- fleet: NER_VEHICLES
- history: HISTORICAL_DISRUPTIONS
"""

from app.data.sources import NER_SOURCE_REGISTRY
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.data.fleet import NER_VEHICLES
from app.data.history import HISTORICAL_DISRUPTIONS

__all__ = [
    "NER_SOURCE_REGISTRY",
    "NER_STATES",
    "NER_DISTRICTS",
    "NER_ROAD_SEGMENTS",
    "NER_BRIDGES",
    "NER_DEPOTS",
    "NER_VEHICLES",
    "HISTORICAL_DISRUPTIONS"
]
