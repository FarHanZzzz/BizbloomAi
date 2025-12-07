# BizBloom AI

BizBloom AI turns a 1–2 sentence idea into a validated, market-ready concept with three refined ideas, market insights, competitor snapshots, risks/opportunities, heuristic validation scores, partner suggestions, and a one-click portfolio export (PDF).

## Tech Stack
- Backend: FastAPI (Python), OpenRouter (Mistral-7B FREE), Sentence Transformers, FAISS, Supabase
- Frontend: React (Vite)
- Storage/DB: Supabase (PostgreSQL + Storage)
- LLM: OpenRouter API (Mistral-7B) - OpenAI-compatible

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
1. Backend env: copy `backend/.env.example` to `backend/.env` and fill keys (OpenRouter, Supabase).
2. Install backend deps: `cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt`
3. Frontend deps: `cd frontend && npm install && npm run dev`
4. Dataset prep: `python backend/scripts/download_kaggle_data.py` (Generates synthetic data if Kaggle keys missing).

## Getting FREE API Keys

### 1. OpenRouter API Key (FREE - Required for LLM)
1. Go to [openrouter.ai](https://openrouter.ai/)
2. Sign up (free)
3. Click **Keys** → **Create Key**
4. Copy the key (starts with `sk-or-...`)
5. Add to `backend/.env`: `OPENROUTER_API_KEY=sk-or-your-key-here`

**Free limits:** Mistral-7B-Instruct:free is currently free to use.

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
OPENROUTER_API_KEY=sk-or-your-key-here
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
JWT_SECRET=your-64-char-random-string
FRONTEND_URL=http://localhost:5173
```

## Datasets
The script `backend/scripts/download_kaggle_data.py` will automatically create the `datasets/` directory and populate it with either:
1. Real Kaggle data (if you provide `KAGGLE_USERNAME/KEY`)
2. Or High-quality synthetic sample data (Default)

## Features (API-level)
- 3 refined startup ideas (deterministic JSON)
- Market insights (industry, trends, segments)
- Competitor snapshot (embedding retrieval)
- Opportunities/risks + mitigation
- Validation scores (rule-based)
- One-page summary (HTML/PDF)
- Partner suggestions (profile similarity)
- Portfolio builder (saves + PDF export)
