from typing import Optional
from supabase import Client, create_client

from app.config import settings

_supabase_client: Optional[Client] = None


def is_supabase_configured() -> bool:
    """Check if Supabase credentials are properly configured (not placeholders)."""
    url = settings.supabase_url
    key = settings.supabase_key
    if not url or not key:
        return False
    if "your-project" in url or url.startswith("https://your"):
        return False
    if "service-role" in key or "anon-key" in key or len(key) < 50:
        return False
    return True


def get_supabase() -> Client:
    """
    Lazy-load Supabase client. Raises if env vars are missing.
    """
    global _supabase_client
    if _supabase_client is None:
        if not settings.supabase_url or not settings.supabase_key:
            raise RuntimeError("Supabase credentials are not configured.")
        _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
    return _supabase_client

