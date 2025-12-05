from fastapi import APIRouter, Depends, HTTPException

from app.auth import authenticate_user, create_access_token, get_current_user, register_user
from app.models.schemas import (
    CompetitorSnapshot,
    IdeaGenerationResponse,
    IdeaInput,
    LoginRequest,
    MarketInsight,
    PartnerProfile,
    Portfolio,
    PortfolioRequest,
    RefinedIdea,
    RegisterRequest,
    RiskOpportunity,
    TokenResponse,
    ValidationScore,
    ValidationRequest,
)
from app.services.competitor_analysis import competitor_snapshot
from app.services.idea_generator import generate_refined_ideas
from app.services.market_insights import generate_market_insight
from app.services.partner_matcher import matcher
from app.services.portfolio_builder import build_portfolio
from app.services.risk_opportunity import assess_risks
from app.services.validation_scorer import score_validation


router = APIRouter(prefix="/api")


@router.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest):
    user = register_user(
        payload.email,
        payload.password,
        {
            "interests": payload.interests or [],
            "skills": payload.skills or [],
            "location": payload.location or "",
            "name": payload.email.split("@")[0],
        },
    )
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token)


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = authenticate_user(payload.email, payload.password)
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token)


@router.get("/auth/me")
def me(user=Depends(get_current_user)):
    return {"user": user}


@router.post("/ideas/generate", response_model=IdeaGenerationResponse)
def ideas_generate(payload: IdeaInput):
    ideas = generate_refined_ideas(payload.idea)
    return IdeaGenerationResponse(ideas=ideas)


@router.post("/ideas/insights", response_model=MarketInsight)
def ideas_insights(idea: RefinedIdea):
    return generate_market_insight(idea)


@router.post("/ideas/competitors", response_model=CompetitorSnapshot)
def ideas_competitors(idea: RefinedIdea):
    return competitor_snapshot(idea)


@router.post("/ideas/assessment", response_model=RiskOpportunity)
def ideas_assessment(idea: RefinedIdea):
    return assess_risks(idea)


@router.post("/ideas/validate", response_model=ValidationScore)
def ideas_validate(payload: ValidationRequest):
    return score_validation(payload.market, payload.competitors)


@router.post("/ideas/summary")
def ideas_summary(portfolio_req: PortfolioRequest):
    # Render only summary (HTML)
    from app.services.summary_generator import render_summary_html

    html = render_summary_html(
        portfolio_req.idea,
        portfolio_req.market_insight,
        portfolio_req.competitor_snapshot,
        portfolio_req.risk_opportunity,
        portfolio_req.validation_score,
        portfolio_req.partners,
    )
    return {"html": html}


@router.get("/partners/suggest", response_model=list[PartnerProfile])
def partners_suggest(user=Depends(get_current_user)):
    profile = user.get("profile") or {}
    return matcher.suggest(profile, limit=3)


@router.post("/portfolio/build", response_model=Portfolio)
def portfolio_build(payload: IdeaInput, user=Depends(get_current_user)):
    profile = user.get("profile") or {}
    return build_portfolio(profile, payload.idea)

