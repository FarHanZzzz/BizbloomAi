# BizBloom AI - Complete User Flow Documentation

## 🗺️ User Journey: Landing to Results

This document traces the complete user journey through BizBloom AI, showing exactly where **APIs** and **Trained Datasets** are utilized at each step.

---

## Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. Landing     │ ──► │  2. Dashboard   │ ──► │  3. Analysis    │ ──► │  4. Results     │
│     Page        │     │   (Input)       │     │   (Processing)  │     │   (Display)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
      │                       │                       │                       │
      ▼                       ▼                       ▼                       ▼
  🔌 Auth API            🔌 Generate API         🔌 Multiple APIs       📊 Display Only
                                                 📂 Dataset Used
```

---

## Step 1: Landing Page (`/`)

**File:** `frontend/src/pages/Landing.jsx`

### User Actions:
- View features and value proposition
- Login or Register

### API Calls:

| Action | API Endpoint | Method | Purpose |
|--------|-------------|--------|---------|
| **Login** | `/api/auth/login` | POST | Authenticate user, get JWT token |
| **Register** | `/api/auth/register` | POST | Create new user account |

### Backend Handler:
```
routes.py → auth.py → database.py (Supabase/In-memory)
```

### Dataset Used: ❌ None

---

## Step 2: Dashboard - Industry Selection

**File:** `frontend/src/pages/Dashboard.jsx`

### User Actions:
- Select industry from 10 options
- Enter startup idea description

### Industries Available:
```
EdTech, FinTech, HealthTech, AI/ML, SaaS, 
E-commerce, FoodTech, Developer Tools, Productivity, Communication
```

### API Calls: ❌ None (local state only)

### Dataset Used: ❌ None (static industry list)

---

## Step 3: Idea Generation

**File:** `frontend/src/pages/Dashboard.jsx` → `backend/app/services/idea_generator.py`

### User Actions:
- Click "Generate AI Ideas"

### API Calls:

| Action | API Endpoint | Method | Purpose |
|--------|-------------|--------|---------|
| **Generate Ideas** | `/api/ideas/generate` | POST | Get 3 refined startup ideas |

### External API Used:
```
🔌 OpenRouter API
   Model: mistralai/mistral-7b-instruct:free
   Purpose: LLM-powered idea refinement
```

### Backend Flow:
```
routes.py 
  → idea_generator.py 
    → OpenRouter API (Mistral-7B)
    → JSON parsing
    → Return 3 RefinedIdea objects
```

### Dataset Used: ❌ None (pure LLM generation)

### Fallback:
If API fails, returns hardcoded sample ideas.

---

## Step 4: Idea Selection & Parallel Analysis

**File:** `frontend/src/pages/Dashboard.jsx`

### User Actions:
- Click on one of the 3 generated ideas

### Triggers 5 Parallel API Calls:

| # | API Endpoint | Service | Uses Dataset? | Uses External API? |
|---|-------------|---------|---------------|-------------------|
| 1 | `/api/ideas/insights` | Market Insights | ✅ Yes | ✅ Optional |
| 2 | `/api/ideas/competitors` | Competitor Analysis | ✅ Yes | ❌ No |
| 3 | `/api/ideas/assessment` | Risk Assessment | ❌ No | ✅ Yes |
| 4 | `/api/ideas/validate` | Validation Score | ❌ No | ❌ No |
| 5 | `/api/partners/suggest` | Partner Matching | ❌ No | ❌ No |

---

## Step 4a: Market Insights

**File:** `backend/app/services/market_insights.py`

### API Endpoint: `POST /api/ideas/insights`

### External API:
```
🔌 OpenRouter API (Optional)
   Model: mistralai/mistral-7b-instruct:free
   Purpose: AI-powered industry classification
```

### Dataset Used:
```
📂 datasets/processed/trend_signals.csv
   Records: 27 industry trends
   Purpose: Keyword matching for trends & segments
   
   Columns:
   - industry: Category name
   - trend: Trend description
```

### Algorithm:
```
1. Try OpenRouter API for intelligent classification
2. If fails, fallback to keyword matching:
   - Match idea text against trend_signals.csv
   - Extract matching trends
   - Derive customer segments
```

---

## Step 4b: Competitor Analysis

**File:** `backend/app/services/competitor_analysis.py`

### API Endpoint: `POST /api/ideas/competitors`

### External API: ❌ None

### Dataset Used:
```
📂 datasets/processed/startup_metadata.csv
   Records: 40 startups
   Columns: name, category, description, funding
   
📂 datasets/processed/startup_index.faiss
   Type: FAISS IndexFlatL2
   Dimensions: 384 (from sentence-transformers)
   Purpose: Fast similarity search
```

### ML Model Used:
```
🧠 sentence-transformers/all-MiniLM-L6-v2
   Type: Transformer (BERT variant)
   Output: 384-dimensional embeddings
   Purpose: Convert text to semantic vectors
```

### Algorithm:
```
1. Embed user's idea using sentence-transformers
2. Search FAISS index for similar vectors
3. Return top 2 most similar startups as competitors
4. Generate market gap based on comparison
```

### Training Process:
```
scripts/download_kaggle_data.py:
1. Load startup descriptions from CSV
2. Generate embeddings for each description
3. Build FAISS index
4. Save to startup_index.faiss
```

---

## Step 4c: Risk Assessment

**File:** `backend/app/services/risk_opportunity.py`

### API Endpoint: `POST /api/ideas/assessment`

### External API:
```
🔌 OpenRouter API
   Model: mistralai/mistral-7b-instruct:free
   Purpose: Generate opportunities, risks, mitigation strategies
```

### Dataset Used: ❌ None

### Algorithm:
```
1. Format prompt with idea details
2. Call OpenRouter API
3. Parse JSON response for:
   - opportunities (2 items)
   - risks (2 items)
   - mitigation strategy
4. If fails, return intelligent fallback
```

---

## Step 4d: Validation Scoring

**File:** `backend/app/services/validation_scorer.py`

### API Endpoint: `POST /api/ideas/validate`

### External API: ❌ None

### Dataset Used: ❌ None (algorithmic calculation)

### Algorithm:
```
Input: market insights + competitor data

Feasibility Score (0-100):
  = (trend_count × 10 + 60) - (competitor_penalty)
  
Novelty Score (0-100):
  = 80 - (competitor_count × 10)
  
Market Readiness:
  = "High" if > 1 competitor
  = "Medium" if health/finance industry
  = "Low" otherwise
```

---

## Step 4e: Partner Matching

**File:** `backend/app/services/partner_matcher.py`

### API Endpoint: `GET /api/partners/suggest`

### External API: ❌ None

### Dataset Used:
```
📂 In-memory user profiles
   Purpose: Match based on interests and skills
```

### ML Model (Design):
```
🧠 sentence-transformers/all-MiniLM-L6-v2
   Purpose: Embed user profiles for similarity matching
```

### Frontend Override:
```
frontend/src/components/PartnerSuggestions.jsx
Contains industry-specific partner pools (20 profiles)
with LinkedIn integration for each industry.
```

---

## Step 5: Results Display

**Files:** 
- `frontend/src/components/MarketInsights.jsx`
- `frontend/src/components/CompetitorPanel.jsx`
- `frontend/src/components/RiskAssessment.jsx`
- `frontend/src/components/ValidationScore.jsx`
- `frontend/src/components/PartnerSuggestions.jsx`

### User Actions:
- View tabbed results
- Click between Market, Competitors, Risks, Scores, Partners

### API Calls: ❌ None (display only)

### Dataset Used: ❌ None (display only)

---

## Step 6: Partner Connection

**File:** `frontend/src/components/PartnerSuggestions.jsx`

### User Actions:
- Click "Connect on LinkedIn" button

### External Link:
```
Opens LinkedIn profile in new tab
Example: https://www.linkedin.com/in/[partner-profile]
```

### API Calls: ❌ None (direct link)

---

## Summary Tables

### API Usage Summary

| Page | Endpoint | External API | Purpose |
|------|----------|-------------|---------|
| Landing | /auth/login | ❌ | User authentication |
| Landing | /auth/register | ❌ | User registration |
| Dashboard | /ideas/generate | ✅ OpenRouter | Idea generation |
| Dashboard | /ideas/insights | ✅ OpenRouter | Market analysis |
| Dashboard | /ideas/competitors | ❌ | Competitor search |
| Dashboard | /ideas/assessment | ✅ OpenRouter | Risk analysis |
| Dashboard | /ideas/validate | ❌ | Score calculation |
| Dashboard | /partners/suggest | ❌ | Partner matching |

### Dataset Usage Summary

| Dataset | Location | Records | Used By |
|---------|----------|---------|---------|
| startup_metadata.csv | datasets/processed/ | 40 | Competitor Analysis |
| startup_index.faiss | datasets/processed/ | 40 vectors | Competitor Analysis |
| trend_signals.csv | datasets/processed/ | 27 | Market Insights |
| professional_profiles.csv | datasets/processed/ | 20 profiles | Partner Matching ✅ NEW |

### ML Model Usage Summary

| Model | Provider | Used By | Purpose |
|-------|----------|---------|---------|
| all-MiniLM-L6-v2 | HuggingFace | Competitor Analysis | Text embeddings |
| Mistral-7B-Instruct | OpenRouter | Idea Gen, Risks, Market | LLM inference |
| FAISS IndexFlatL2 | Facebook | Competitor Analysis | Vector search |

---

## Visual Flow

```
USER JOURNEY:
═══════════════════════════════════════════════════════════════════════════

[Landing Page]
     │
     ├─► Login/Register ──► 🔌 /auth/login or /auth/register
     │
     ▼
[Dashboard - Step 1]
     │
     ├─► Select Industry (EdTech, FinTech, etc.) - No API
     ├─► Enter Idea Description - No API
     │
     ▼
[Dashboard - Step 2]
     │
     ├─► Generate Ideas ──► 🔌 /ideas/generate ──► 🤖 OpenRouter (Mistral-7B)
     │
     ▼
[Dashboard - Step 3: Select Idea]
     │
     ├─► Market Insights ──► 🔌 /ideas/insights ──► 📂 trend_signals.csv + 🤖 OpenRouter
     ├─► Competitors ──► 🔌 /ideas/competitors ──► 📂 startup_metadata.csv + 🧠 FAISS
     ├─► Risks ──► 🔌 /ideas/assessment ──► 🤖 OpenRouter (Mistral-7B)
     ├─► Validation ──► 🔌 /ideas/validate ──► 📊 Algorithmic
     ├─► Partners ──► 🔌 /partners/suggest ──► 👥 Profile Matching
     │
     ▼
[Results Display]
     │
     ├─► View 5 Tabs - No API
     ├─► Connect Partner ──► 🔗 LinkedIn External Link
     │
     ▼
[End]

═══════════════════════════════════════════════════════════════════════════
LEGEND:
🔌 = API Call
📂 = Dataset Used
🤖 = LLM API (OpenRouter)
🧠 = ML Model (FAISS/Embeddings)
📊 = Algorithmic Calculation
🔗 = External Link
═══════════════════════════════════════════════════════════════════════════
```

---

## Quick Reference

**To start the application:**
```powershell
cd d:\BizbloomAi
.\start.bat
```

**Access points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
