from typing import Any, List, Optional
from pydantic import BaseModel, Field, EmailStr


class IdeaInput(BaseModel):
    idea: str = Field(..., min_length=5, max_length=500)


class RefinedIdea(BaseModel):
    name: str
    problem: str
    solution: str
    value_proposition: str


class IdeaGenerationResponse(BaseModel):
    ideas: List[RefinedIdea]


class MarketInsight(BaseModel):
    industry: str
    top_trends: List[str]
    customer_segments: List[str]


class Competitor(BaseModel):
    name: str
    short_description: str
    url_if_known: Optional[str] = None


class CompetitorSnapshot(BaseModel):
    competitors: List[Competitor]
    market_gap: str


class RiskOpportunity(BaseModel):
    opportunities: List[str]
    risks: List[str]
    mitigation: str


class ValidationScore(BaseModel):
    feasibility_score: int
    novelty_score: int
    market_readiness: str

class ValidationRequest(BaseModel):
    idea: Optional[RefinedIdea] = None
    market: Optional[MarketInsight] = None
    competitors: Optional[CompetitorSnapshot] = None


class PartnerProfile(BaseModel):
    name: str
    interest_overlap_score: float
    skills: List[str]
    contact_hint: str


class PortfolioRequest(BaseModel):
    idea: RefinedIdea
    market_insight: MarketInsight
    competitor_snapshot: CompetitorSnapshot
    risk_opportunity: RiskOpportunity
    validation_score: ValidationScore
    partners: List[PartnerProfile]


class Portfolio(BaseModel):
    portfolio_id: str
    pdf_url: Optional[str]
    data: Any


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

