"""
NERALIS Security, Authentication, API Key Verification & Role-Based Access Control (RBAC).
"""

import hashlib
import secrets
from fastapi import Header, HTTPException, Security
from typing import Optional
from app.core.config import settings

VALID_ROLES = {
    "ADMIN",
    "DISTRICT_COLLECTOR",
    "FIRST_RESPONDER",
    "PWD_ENGINEER",
    "TRANSPORT_OPERATOR",
    "PUBLIC_VIEWER",
    # Frontend aliases
    "STATE_ADMIN",
    "LOGISTICS_OPERATOR",
    "FIELD_INSPECTOR",
    "CITIZEN"
}

ROLE_MAP_TO_BACKEND = {
    "STATE_ADMIN": "ADMIN",
    "DISTRICT_COLLECTOR": "DISTRICT_COLLECTOR",
    "LOGISTICS_OPERATOR": "TRANSPORT_OPERATOR",
    "FIELD_INSPECTOR": "PWD_ENGINEER",
    "CITIZEN": "PUBLIC_VIEWER",
    "ADMIN": "ADMIN",
    "TRANSPORT_OPERATOR": "TRANSPORT_OPERATOR",
    "PWD_ENGINEER": "PWD_ENGINEER",
    "FIRST_RESPONDER": "FIRST_RESPONDER",
    "PUBLIC_VIEWER": "PUBLIC_VIEWER"
}

ROLE_MAP_TO_FRONTEND = {
    "ADMIN": "STATE_ADMIN",
    "STATE_ADMIN": "STATE_ADMIN",
    "DISTRICT_COLLECTOR": "DISTRICT_COLLECTOR",
    "TRANSPORT_OPERATOR": "LOGISTICS_OPERATOR",
    "LOGISTICS_OPERATOR": "LOGISTICS_OPERATOR",
    "PWD_ENGINEER": "FIELD_INSPECTOR",
    "FIELD_INSPECTOR": "FIELD_INSPECTOR",
    "FIRST_RESPONDER": "FIELD_INSPECTOR",
    "PUBLIC_VIEWER": "CITIZEN",
    "CITIZEN": "CITIZEN"
}

def hash_password(password: str, salt: Optional[str] = None) -> str:
    """
    Hashes a password with SHA-256 and a cryptographic salt.
    Format: salt$hex_hash
    """
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password + settings.SECRET_KEY).encode("utf-8")).hexdigest()
    return f"{salt}${hashed}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against the stored salt$hash string.
    """
    if not hashed_password or "$" not in hashed_password:
        return False
    salt, expected_hash = hashed_password.split("$", 1)
    computed = hashlib.sha256((salt + plain_password + settings.SECRET_KEY).encode("utf-8")).hexdigest()
    return secrets.compare_digest(computed, expected_hash)

def generate_session_token(user_id: str, role: str) -> str:
    """
    Generates a secure bearer token.
    """
    raw = f"{user_id}:{role}:{secrets.token_hex(24)}"
    return secrets.token_urlsafe(32)

def get_current_role(x_role: Optional[str] = Header(None)) -> str:
    """
    Extracts and normalizes the user's role from the X-Role request header.
    Defaults to PUBLIC_VIEWER if omitted.
    """
    if not x_role:
        return "PUBLIC_VIEWER"
    role_upper = x_role.upper().strip()
    return ROLE_MAP_TO_BACKEND.get(role_upper, "PUBLIC_VIEWER")

def require_authorized_role(
    required_roles: list,
    x_role: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None)
) -> str:
    """
    Ensures the caller has one of the required roles or a valid API key.
    """
    user_role = get_current_role(x_role)
    if user_role in required_roles:
        return user_role
    
    # If API key is provided and matches configured key, grant elevated access
    if x_api_key and x_api_key == settings.DEFAULT_API_KEY:
        return "ADMIN"
    
    raise HTTPException(
        status_code=403,
        detail=f"Forbidden: Action requires one of {required_roles}. Current role is '{user_role}'."
    )

