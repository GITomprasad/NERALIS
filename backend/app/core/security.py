"""
NERALIS Security, API Key Verification & Role-Based Access Control (RBAC).
"""

from fastapi import Header, HTTPException, Security
from typing import Optional
from app.core.config import settings

VALID_ROLES = {
    "ADMIN",
    "DISTRICT_COLLECTOR",
    "FIRST_RESPONDER",
    "PWD_ENGINEER",
    "TRANSPORT_OPERATOR",
    "PUBLIC_VIEWER"
}

def get_current_role(x_role: Optional[str] = Header(None)) -> str:
    """
    Extracts and normalizes the user's role from the X-Role request header.
    Defaults to PUBLIC_VIEWER if omitted.
    """
    if not x_role:
        return "PUBLIC_VIEWER"
    role_upper = x_role.upper().strip()
    if role_upper not in VALID_ROLES:
        return "PUBLIC_VIEWER"
    return role_upper

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
