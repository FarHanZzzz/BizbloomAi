from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.config import settings
from app.database import get_supabase, is_supabase_configured


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8




def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# In-memory demo users for when Supabase is not configured
_demo_users: dict = {
    "demo@bizbloom.ai": {
        "id": "demo-user-id",
        "email": "demo@bizbloom.ai",
        "hashed_password": hash_password("demo123"),
        "profile": {"name": "Demo User"},
    }
}


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=ALGORITHM)


def register_user(email: str, password: str, profile: dict | None = None) -> dict:
    if not is_supabase_configured():
        # Demo mode: store in memory
        if email in _demo_users:
            raise HTTPException(status_code=400, detail="User already exists")
        user_id = str(uuid.uuid4())
        hashed = hash_password(password)
        user = {
            "id": user_id,
            "email": email,
            "hashed_password": hashed,
            "profile": profile or {},
        }
        _demo_users[email] = user
        return user

    client = get_supabase()
    existing = client.table("users").select("*").eq("email", email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = hash_password(password)
    profile = profile or {}
    result = client.table("users").insert(
        {"email": email, "hashed_password": hashed, "profile": profile}
    ).execute()
    return result.data[0]


def authenticate_user(email: str, password: str) -> dict:
    if not is_supabase_configured():
        # Demo mode: check in-memory
        user = _demo_users.get(email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(password, user.get("hashed_password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user

    client = get_supabase()
    result = client.table("users").select("*").eq("email", email).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = result.data[0]
    if not verify_password(password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Could not validate credentials") from exc

    if not is_supabase_configured():
        # Demo mode: find user by email in memory
        user = _demo_users.get(email)
        if not user or user.get("id") != user_id:
            raise HTTPException(status_code=401, detail="User not found")
        return user

    client = get_supabase()
    result = client.table("users").select("*").eq("id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="User not found")
    user = result.data[0]
    if user.get("email") != email:
        raise HTTPException(status_code=401, detail="Token mismatch")
    return user

