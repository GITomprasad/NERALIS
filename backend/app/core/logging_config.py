"""
NERALIS Structured Logging Configuration.
Outputs structured JSON lines with request latency, event context, and audit traces.
"""

import json
import logging
import time
import datetime
from typing import Dict, Any, Optional

class StructuredJsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            log_obj.update(record.extra_data)
        return json.dumps(log_obj)

logger = logging.getLogger("neralis")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(StructuredJsonFormatter())
    logger.addHandler(handler)

def log_event(
    event_type: str,
    action: str,
    outcome: str = "SUCCESS",
    latency_ms: Optional[float] = None,
    details: Optional[Dict[str, Any]] = None
):
    extra = {
        "event_type": event_type,
        "action": action,
        "outcome": outcome
    }
    if latency_ms is not None:
        extra["latency_ms"] = round(latency_ms, 2)
    if details:
        extra["details"] = details
    
    logger.info(f"[{event_type}] {action} -> {outcome}", extra={"extra_data": extra})
