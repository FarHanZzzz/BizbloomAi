from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.config import settings
from app.database import get_supabase


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=ALGORITHM)


def register_user(email: str, password: str, profile: dict | None = None) -> dict:
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

    client = get_supabase()
    result = client.table("users").select("*").eq("id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="User not found")
    user = result.data[0]
    if user.get("email") != email:
        raise HTTPException(status_code=401, detail="Token mismatch")
    return user

