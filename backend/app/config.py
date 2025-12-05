from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_key: str = ""
    jwt_secret: str = "change-me"
    frontend_url: str = "http://localhost:5173"
    dataset_dir: str = "../datasets"
    processed_dir: str = "../datasets/processed"
    model_name: str = "gpt-4o-mini"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

