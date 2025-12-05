# Backend (FastAPI)

## Setup
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # fill values
uvicorn app.main:app --reload
```

## Key Files
- `app/main.py` — FastAPI entry
- `app/api/routes.py` — REST endpoints
- `app/services/` — AI + retrieval services
- `app/models/schemas.py` — Pydantic models
- `app/auth.py` — JWT + password hashing
- `scripts/process_datasets.py` — builds embedding index
- `migrations/001_init.sql` — Supabase schema

## Environment
```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
DATASET_DIR=../datasets
PROCESSED_DIR=../datasets/processed
MODEL_NAME=gpt-4o-mini
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## Running dataset processor
```
python scripts/process_datasets.py --model sentence-transformers/all-MiniLM-L6-v2
```

