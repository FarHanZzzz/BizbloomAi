from math import exp
from typing import List

from app.models.schemas import CompetitorSnapshot, MarketInsight, ValidationScore


def _score_feasibility(trends: List[str], competitors_count: int) -> int:
    trend_signal = min(len(trends), 3) * 10 + 60
    comp_penalty = max(0, competitors_count - 1) * 5
    return max(0, min(100, trend_signal - comp_penalty))


def _score_novelty(competitors_count: int) -> int:
    # Fewer close competitors -> higher novelty
    base = 80
    penalty = min(30, competitors_count * 10)
    return max(0, min(100, base - penalty))


def _market_readiness(industry: str, competitors_count: int) -> str:
    industry_lower = industry.lower()
    if "health" in industry_lower or "finance" in industry_lower:
        tier = "Medium"
    elif competitors_count <= 1:
        tier = "Low"
    else:
        tier = "High"
    return tier


def score_validation(market: MarketInsight, competitors: CompetitorSnapshot) -> ValidationScore:
    comp_count = len(competitors.competitors)
    feasibility = _score_feasibility(market.top_trends, comp_count)
    novelty = _score_novelty(comp_count)
    readiness = _market_readiness(market.industry, comp_count)
    return ValidationScore(
        feasibility_score=feasibility,
        novelty_score=novelty,
        market_readiness=readiness,
    )

