from app.models.schemas import (
    CompetitorSnapshot,
    MarketInsight,
    PartnerProfile,
    Portfolio,
    RefinedIdea,
    RiskOpportunity,
    ValidationScore,
)
from app.services.competitor_analysis import competitor_snapshot
from app.services.idea_generator import generate_refined_ideas
from app.services.market_insights import generate_market_insight
from app.services.partner_matcher import matcher
from app.services.risk_opportunity import assess_risks
from app.services.summary_generator import generate_pdf, render_summary_html
from app.services.validation_scorer import score_validation


def build_portfolio(user_profile: dict, user_input: str) -> Portfolio:
    refined = generate_refined_ideas(user_input)
    # take first idea as selected for the portfolio
    idea: RefinedIdea = refined[0]
    market: MarketInsight = generate_market_insight(idea)
    competitors: CompetitorSnapshot = competitor_snapshot(idea)
    risk: RiskOpportunity = assess_risks(idea)
    scores: ValidationScore = score_validation(market, competitors)
    partners: list[PartnerProfile] = matcher.suggest(user_profile, limit=3)

    html = render_summary_html(idea, market, competitors, risk, scores, partners)
    pdf_path = generate_pdf(html, filename="portfolio.pdf")

    data = {
        "idea": idea.model_dump(),
        "market": market.model_dump(),
        "competitors": competitors.model_dump(),
        "risks": risk.model_dump(),
        "scores": scores.model_dump(),
        "partners": [p.model_dump() for p in partners],
    }

    return Portfolio(
        portfolio_id="portfolio-001",
        pdf_url=pdf_path,
        data=data,
    )

