from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # OpenRouter API (OpenAI-compatible, many free models)
    openrouter_api_key: str = ""
    openrouter_model: str = "mistralai/mistral-7b-instruct:free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # Supabase (optional)
    supabase_url: str = ""
    supabase_key: str = ""
    
    # JWT for auth
    jwt_secret: str = "change-me"
    
    # Frontend URL for CORS
    frontend_url: str = "http://localhost:5173"
    
    # Dataset paths
    dataset_dir: str = "../datasets"
    processed_dir: str = "../datasets/processed"
    
    # Embedding model (runs locally, no API needed)
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"


settings = Settings()
