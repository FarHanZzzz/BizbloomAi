from typing import Optional
from supabase import Client, create_client

from app.config import settings

_supabase_client: Optional[Client] = None


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

