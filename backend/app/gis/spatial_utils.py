"""
NERALIS GIS & Spatial Processing Utilities.
"""

import math
from typing import Tuple, List, Dict, Any, Optional

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two points on Earth using Haversine formula.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2 +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

def is_point_in_bbox(lat: float, lng: float, bbox: Tuple[float, float, float, float]) -> bool:
    """
    Checks if a point (lat, lng) falls within a bounding box (min_lat, min_lng, max_lat, max_lng).
    """
    min_lat, min_lng, max_lat, max_lng = bbox
    return min_lat <= lat <= max_lat and min_lng <= lng <= max_lng

def parse_bbox_string(bbox_str: Optional[str]) -> Optional[Tuple[float, float, float, float]]:
    """
    Parses a string formatted as 'min_lat,min_lng,max_lat,max_lng'.
    """
    if not bbox_str:
        return None
    try:
        parts = [float(x.strip()) for x in bbox_str.split(",")]
        if len(parts) == 4:
            return (parts[0], parts[1], parts[2], parts[3])
    except (ValueError, IndexError):
        pass
    return None
