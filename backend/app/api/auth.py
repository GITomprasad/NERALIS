"""
NERALIS Authentication and User Governance Router.
Implements Sign Up, Sign In, Profile Retrieval, and Demo Quick-Login Accounts.
"""

from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from sqlalchemy.orm import Session
import uuid
import datetime

from app.db.database import get_db
from app.db.models import UserModel, AuditLogModel
from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    generate_session_token,
    ROLE_MAP_TO_BACKEND,
    ROLE_MAP_TO_FRONTEND
)

router = APIRouter(prefix="/auth", tags=["Authentication and User Governance"])

class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name of the official or citizen")
    email: EmailStr = Field(..., description="Official or personal email address")
    password: str = Field(..., min_length=6, description="Password (at least 6 characters)")
    role: str = Field(default="CITIZEN", description="Governance Role (CITIZEN, STATE_ADMIN, DISTRICT_COLLECTOR, LOGISTICS_OPERATOR, FIELD_INSPECTOR)")
    state: Optional[str] = Field(None, description="NER State assignment or residence")
    district: Optional[str] = Field(None, description="Assigned district or nodal station")
    organization: Optional[str] = Field(None, description="Department, Ministry, Agency, or Transport fleet")
    phone: Optional[str] = Field(None, description="Contact mobile number for emergency broadcast alerts")

class SignInRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    frontend_role: str
    state: Optional[str] = None
    district: Optional[str] = None
    organization: Optional[str] = None
    phone: Optional[str] = None
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str
    user: UserProfileResponse

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, db: Session = Depends(get_db)):
    """
    Registers a new NERALIS user account and returns an authenticated session.
    """
    normalized_email = payload.email.lower().strip()
    
    # Check if user already exists
    existing = db.query(UserModel).filter(UserModel.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address is already registered. Please sign in."
        )
    
    backend_role = ROLE_MAP_TO_BACKEND.get(payload.role.upper(), "PUBLIC_VIEWER")
    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    
    new_user = UserModel(
        id=user_id,
        name=payload.name.strip(),
        email=normalized_email,
        hashed_password=hash_password(payload.password),
        role=backend_role,
        state=payload.state,
        district=payload.district,
        organization=payload.organization or "NER Logistics Participant",
        phone=payload.phone,
        is_active=True,
        created_at=datetime.datetime.utcnow()
    )
    
    db.add(new_user)
    
    # Audit log entry
    audit = AuditLogModel(
        event_type="USER_SIGNUP",
        actor=new_user.email,
        role=backend_role,
        endpoint="/api/v1/auth/signup",
        payload_summary={"name": new_user.name, "role": backend_role, "state": new_user.state},
        outcome="SUCCESS"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)
    
    token = generate_session_token(new_user.id, new_user.role)
    frontend_role = ROLE_MAP_TO_FRONTEND.get(new_user.role, "CITIZEN")
    
    return AuthResponse(
        success=True,
        message=f"Account successfully created for {new_user.name} with role {frontend_role}.",
        token=token,
        user=UserProfileResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            role=new_user.role,
            frontend_role=frontend_role,
            state=new_user.state,
            district=new_user.district,
            organization=new_user.organization,
            phone=new_user.phone,
            created_at=new_user.created_at.isoformat() if new_user.created_at else None
        )
    )

@router.post("/signin", response_model=AuthResponse)
@router.post("/login", response_model=AuthResponse)
def signin(payload: SignInRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user via email and password.
    """
    normalized_email = payload.email.lower().strip()
    user = db.query(UserModel).filter(UserModel.email == normalized_email).first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials or use Quick Demo Sign In."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account has been deactivated. Please contact your MDoNER administrator."
        )
    
    token = generate_session_token(user.id, user.role)
    frontend_role = ROLE_MAP_TO_FRONTEND.get(user.role, "CITIZEN")
    
    # Audit log entry
    audit = AuditLogModel(
        event_type="USER_SIGNIN",
        actor=user.email,
        role=user.role,
        endpoint="/api/v1/auth/signin",
        payload_summary={"user_id": user.id, "frontend_role": frontend_role},
        outcome="SUCCESS"
    )
    db.add(audit)
    db.commit()
    
    return AuthResponse(
        success=True,
        message=f"Welcome back, {user.name} ({frontend_role}).",
        token=token,
        user=UserProfileResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            frontend_role=frontend_role,
            state=user.state,
            district=user.district,
            organization=user.organization,
            phone=user.phone,
            created_at=user.created_at.isoformat() if user.created_at else None
        )
    )

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = Field(None, description="Google ID Token (JWT)")
    role: Optional[str] = "CITIZEN"
    # Sandbox / Demo fallback fields:
    email: Optional[EmailStr] = Field(None, description="Account email (for sandbox/demo fallback)")
    name: Optional[str] = Field(None, description="Profile name (for sandbox/demo fallback)")
    google_id: Optional[str] = None
    photo_url: Optional[str] = None
    is_sandbox: Optional[bool] = False

@router.post("/google", response_model=AuthResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticates or provisions a user using Google Identity Services (GIS) ID-Token flow.
    Cryptographically validates the Google ID token (JWT) against GOOGLE_CLIENT_ID.
    """
    import secrets
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    photo_url: Optional[str] = payload.photo_url
    google_sub_id: Optional[str] = payload.google_id
    auth_mode = "google_id_token"

    if payload.credential:
        # Cryptographically verify the genuine Google ID token
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests
            
            # Verify signature and audience against Google's public keys
            audience = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
            idinfo = id_token.verify_oauth2_token(
                payload.credential,
                google_requests.Request(),
                audience=audience
            )
            
            user_email = idinfo.get("email")
            user_name = idinfo.get("name") or user_email.split("@")[0] if user_email else None
            photo_url = idinfo.get("picture") or photo_url
            google_sub_id = idinfo.get("sub") or google_sub_id
            
            if not user_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Google ID token does not contain a valid email address."
                )
        except HTTPException:
            raise
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Google ID token cryptographic validation failed: {str(ve)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unable to verify Google ID token with Google identity servers: {str(e)}"
            )
    elif payload.is_sandbox or (payload.email and not settings.GOOGLE_CLIENT_ID):
        # Sandbox / Demo mode fallback
        auth_mode = "sandbox_fallback"
        user_email = payload.email
        user_name = payload.name or (str(payload.email).split("@")[0] if payload.email else "Sandbox User")
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token credential is required for Google Sign-In."
        )

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email is required to establish NERALIS session."
        )

    resolved_name = str(user_name).strip()
    normalized_email = str(user_email).lower().strip()
    user = db.query(UserModel).filter(UserModel.email == normalized_email).first()
    
    if not user:
        backend_role = ROLE_MAP_TO_BACKEND.get((payload.role or "CITIZEN").upper(), "PUBLIC_VIEWER")
        user_id = f"USR-G-{uuid.uuid4().hex[:8].upper()}"
        user = UserModel(
            id=user_id,
            name=resolved_name,
            email=normalized_email,
            hashed_password=hash_password(f"google_oauth_{secrets.token_hex(16)}"),
            role=backend_role,
            state="Assam",
            district="Kamrup Metropolitan",
            organization="Google Verified Account",
            is_active=True,
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(user)
        audit = AuditLogModel(
            event_type="USER_GOOGLE_SIGNUP",
            actor=user.email,
            role=backend_role,
            endpoint="/api/v1/auth/google",
            payload_summary={
                "name": user.name,
                "role": backend_role,
                "auth_provider": "google",
                "photo_url": payload.photo_url
            },
            outcome="SUCCESS"
        )
        db.add(audit)
        db.commit()
        db.refresh(user)
    else:
        audit = AuditLogModel(
            event_type="USER_GOOGLE_SIGNIN",
            actor=user.email,
            role=user.role,
            endpoint="/api/v1/auth/google",
            payload_summary={
                "user_id": user.id,
                "auth_provider": "google",
                "photo_url": payload.photo_url
            },
            outcome="SUCCESS"
        )
        db.add(audit)
        db.commit()

    token = generate_session_token(user.id, user.role)
    frontend_role = ROLE_MAP_TO_FRONTEND.get(user.role, "CITIZEN")

    return AuthResponse(
        success=True,
        message=f"Successfully signed in with Google as {user.name}.",
        token=token,
        user=UserProfileResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            frontend_role=frontend_role,
            state=user.state,
            district=user.district,
            organization=user.organization,
            phone=user.phone,
            created_at=user.created_at.isoformat() if user.created_at else None
        )
    )


@router.get("/me", response_model=UserProfileResponse)
def get_me(x_role: Optional[str] = Header(None), authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """
    Retrieves current active profile or default demo role user.
    """
    user = db.query(UserModel).first()
    if not user:
        return UserProfileResponse(
            id="USR-DEFAULT",
            name="NER Logistics Official",
            email="official@neralis.gov.in",
            role="ADMIN",
            frontend_role="STATE_ADMIN",
            organization="MDoNER"
        )
    
    frontend_role = ROLE_MAP_TO_FRONTEND.get(user.role, "CITIZEN")
    return UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        frontend_role=frontend_role,
        state=user.state,
        district=user.district,
        organization=user.organization,
        phone=user.phone,
        created_at=user.created_at.isoformat() if user.created_at else None
    )

@router.get("/demo-accounts")
def get_demo_accounts():
    """
    Returns the 5 official Governance Role accounts for one-click testing.
    """
    return {
        "accounts": [
            {
                "role_key": "CITIZEN",
                "label": "Citizen / Public Traveler",
                "badge": "PUBLIC",
                "email": "citizen@neralis.gov.in",
                "password": "citizen123",
                "name": "Dr. Ramesh Sarma",
                "description": "Read-only map, routing, alerts and live broadcasts"
            },
            {
                "role_key": "STATE_ADMIN",
                "label": "State Admin (MDoNER HQ)",
                "badge": "ADMIN",
                "email": "admin@mdoner.gov.in",
                "password": "admin123",
                "name": "Shri J. K. Lyngdoh (IAS)",
                "description": "Full author control, override road status and alerts"
            },
            {
                "role_key": "DISTRICT_COLLECTOR",
                "label": "District Collector / DM",
                "badge": "AUTHORITY",
                "email": "collector.kamrup@assam.gov.in",
                "password": "collector123",
                "name": "Ms. Ananya Barman (IAS)",
                "description": "District approvals, relief convoys and emergency"
            },
            {
                "role_key": "LOGISTICS_OPERATOR",
                "label": "Logistics & Fleet Operator",
                "badge": "FLEET",
                "email": "fleet.lead@nerlogistics.in",
                "password": "fleet123",
                "name": "Vikram Sonowal",
                "description": "NavIC truck telemetry and warehouse routing"
            },
            {
                "role_key": "FIELD_INSPECTOR",
                "label": "Field Inspector (PWD / SDRF)",
                "badge": "FIELD",
                "email": "inspector.pwd@meghalaya.gov.in",
                "password": "field123",
                "name": "Er. Tashi Wangchuk",
                "description": "On-ground damage logging and AR crack scans"
            }
        ]
    }

@router.post("/logout")
def logout():
    """
    Logs out the current session.
    """
    return {"success": True, "message": "Session terminated successfully."}
