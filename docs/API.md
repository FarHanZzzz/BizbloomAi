# BizBloom AI API

Base URL: `/api`

## Auth
- `POST /api/auth/register` — body: `{ email, password, interests?, skills?, location? }` → JWT
- `POST /api/auth/login` — body: `{ email, password }` → JWT
- `GET /api/auth/me` — headers: `Authorization: Bearer <token>` → user profile

## Core Features
- `POST /api/ideas/generate` — `{ idea }` → 3 refined ideas
- `POST /api/ideas/insights` — `RefinedIdea` → market insight
- `POST /api/ideas/competitors` — `RefinedIdea` → competitor snapshot
- `POST /api/ideas/assessment` — `RefinedIdea` → opportunities/risks/mitigation
- `POST /api/ideas/validate` — body: `RefinedIdea`, `MarketInsight`, `CompetitorSnapshot` → validation scores
- `POST /api/ideas/summary` — `PortfolioRequest` → HTML summary
- `GET /api/partners/suggest` — JWT required → partner suggestions
- `POST /api/portfolio/build` — `{ idea }` + JWT → full portfolio (HTML/PDF path)

