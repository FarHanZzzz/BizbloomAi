from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    openai_api_key: str = ""
    openai_base_url: str = "https://api.groq.com/openai/v1"  # Groq free API (OpenAI-compatible)
    supabase_url: str = ""
    supabase_key: str = ""
    jwt_secret: str = "change-me"
    frontend_url: str = "http://localhost:5173"
    dataset_dir: str = "../datasets"
    processed_dir: str = "../datasets/processed"
    model_name: str = "llama-3.3-70b-versatile"  # Free Groq model
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

