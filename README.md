# BizBloom AI

BizBloom AI turns a 1–2 sentence idea into a validated, market-ready concept with three refined ideas, market insights, competitor snapshots, risks/opportunities, heuristic validation scores, partner suggestions, and a one-click portfolio export (PDF).

## Tech Stack
- Backend: FastAPI (Python), OpenAI, Sentence Transformers, FAISS, Supabase
- Frontend: React (Vite)
- Storage/DB: Supabase (PostgreSQL + Storage)

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
1. Backend env: copy `backend/.env.example` to `.env` and fill keys (OpenAI, Supabase).
2. Install backend deps: `cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt`
3. Frontend deps: `cd frontend && npm install && npm run dev`
4. Dataset prep: place Kaggle CSVs under `datasets/` (see `datasets/README.md`), then run `python backend/scripts/process_datasets.py`.

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
