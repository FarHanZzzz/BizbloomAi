# BizBloom AI

BizBloom AI turns a 1–2 sentence idea into a validated, market-ready concept with three refined ideas, market insights, competitor snapshots, risks/opportunities, heuristic validation scores, partner suggestions, and a one-click portfolio export (PDF).

## Tech Stack
- Backend: FastAPI (Python), Groq (FREE LLM API), Sentence Transformers, FAISS, Supabase
- Frontend: React (Vite)
- Storage/DB: Supabase (PostgreSQL + Storage)
- LLM: Groq API (FREE - Llama 3.3 70B) - OpenAI-compatible

## Quick Start (One Command!)

### Windows
```batch
# First time setup (installs all dependencies)
setup.bat

# Start both servers
start.bat
```

### Linux/Mac
```bash
# First time setup (installs all dependencies)
chmod +x setup.sh start.sh
./setup.sh

# Start both servers
./start.sh
```

### Manual Setup
1. Backend env: copy `backend/.env.example` to `.env` and fill keys (Groq, Supabase).
2. Install backend deps: `cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt`
3. Frontend deps: `cd frontend && npm install && npm run dev`
4. Dataset prep: place Kaggle CSVs under `datasets/` (see `datasets/README.md`), then run `python backend/scripts/process_datasets.py`.

## Getting FREE API Keys

### 1. Groq API Key (FREE - Required for LLM)
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up with Google/GitHub (free)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)
5. Add to `backend/.env`: `OPENAI_API_KEY=gsk_your-key-here`

**Free limits:** 30 requests/min, 14,400 requests/day - plenty for development!

### 2. Supabase (FREE tier)
1. Go to [supabase.com](https://supabase.com/) → **Start your project**
2. Create new project (free tier)
3. Go to **Settings** → **API**
4. Copy **Project URL** → `SUPABASE_URL`
5. Copy **anon public key** → `SUPABASE_KEY`
6. Run `backend/migrations/001_init.sql` in Supabase SQL Editor

### 3. JWT Secret
Generate a random string (64 chars):
```python
import secrets; print(secrets.token_hex(32))
```

### Sample `.env` file
```env
OPENAI_API_KEY=gsk_your-groq-api-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
MODEL_NAME=llama-3.3-70b-versatile
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
JWT_SECRET=your-64-char-random-string
FRONTEND_URL=http://localhost:5173
DATASET_DIR=../datasets
PROCESSED_DIR=../datasets/processed
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## Datasets
User-provided datasets live at `d:/BizBloomAI Datasets-20251205T114124Z-1-001/BizBloomAI Datasets/`. Copy the needed CSVs into `datasets/` before running the processing script.

## Features (API-level)
- 3 refined startup ideas (deterministic JSON)
- Market insights (industry, trends, segments)
- Competitor snapshot (embedding retrieval)
- Opportunities/risks + mitigation
- Validation scores (rule-based)
- One-page summary (HTML/PDF)
- Partner suggestions (profile similarity)
- Portfolio builder (saves + PDF export)
