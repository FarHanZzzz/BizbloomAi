# BizBloom AI - Feature to Dataset/API Mapping

## Quick Reference: What Uses What

| Feature | Dataset Used | API Used | ML Model |
|---------|-------------|----------|----------|
| **Idea Generation** | ❌ None | ✅ OpenRouter | Mistral-7B-Instruct |
| **Market Insights** | ✅ trend_signals.csv | ✅ OpenRouter | Mistral-7B-Instruct |
| **Competitor Analysis** | ✅ startup_metadata.csv + startup_index.faiss | ❌ None | sentence-transformers + FAISS |
| **Risk Assessment** | ❌ None | ✅ OpenRouter | Mistral-7B-Instruct |
| **Validation Score** | ❌ None | ✅ OpenRouter | Mistral-7B-Instruct |
| **Partner Matching** | ✅ professional_profiles.csv | ❌ None | sentence-transformers |

---

## Detailed Breakdown

### 1. AI-Refined Startup Idea Generation
```
Dataset: None
API: OpenRouter (Mistral-7B)
Process: User input → LLM generates 3 refined ideas
```

### 2. Market Insight Generation
```
Dataset: datasets/processed/trend_signals.csv (27 records)
API: OpenRouter (Mistral-7B) - optional, with fallback
Process: LLM classifies industry → Dataset provides trends/segments
```

### 3. Competitor Snapshot
```
Dataset: 
  - datasets/processed/startup_metadata.csv (40 companies)
  - datasets/processed/startup_index.faiss (40 vectors)
API: None
Process: Embed user idea → FAISS similarity search → Return top matches
```

### 4. Opportunity & Risk Assessment
```
Dataset: None
API: OpenRouter (Mistral-7B)
Process: LLM analyzes idea → Generates opportunities, risks, mitigation
```

### 5. Validation Score
```
Dataset: None  
API: OpenRouter (Mistral-7B)
Process: LLM analyzes all data → Returns scores with reasoning
Fallback: Algorithmic calculation if API fails
```

### 6. Partner Matching
```
Dataset: datasets/processed/professional_profiles.csv (20 professionals)
API: None
Process: Embed user profile → Cosine similarity with dataset → Top matches
```

---

## Dataset Files Summary

| File | Location | Records | Format |
|------|----------|---------|--------|
| trend_signals.csv | datasets/processed/ | 27 | industry, trend |
| startup_metadata.csv | datasets/processed/ | 40 | name, category, description |
| startup_index.faiss | datasets/processed/ | 40 vectors | FAISS binary index |
| professional_profiles.csv | datasets/processed/ | 20 | name, industry, skills, linkedin_url |

---

## API Configuration

```env
# .env file
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
```

**Note:** The existing OpenRouter key works for all features.
