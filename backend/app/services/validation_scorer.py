import json
from typing import Optional

from openai import OpenAI

from app.config import settings
from app.models.schemas import CompetitorSnapshot, MarketInsight, RefinedIdea, ValidationScore


SYSTEM_PROMPT = """You are a startup validation expert. Analyze the startup idea and market data.
Return JSON with:
- feasibility_score: integer 0-100 (based on technical complexity, resources needed, market timing)
- novelty_score: integer 0-100 (based on uniqueness vs competitors)
- market_readiness: "High", "Medium", or "Low"
- feasibility_reasoning: 1-2 sentence explanation
- novelty_reasoning: 1-2 sentence explanation
- readiness_reasoning: 1-2 sentence explanation

Be specific and data-driven in your analysis."""


def _algorithmic_score(
    market: Optional[MarketInsight], 
    competitors: Optional[CompetitorSnapshot]
) -> ValidationScore:
    """Fallback algorithmic scoring when AI is unavailable."""
    # Default values
    if market is None:
        market_industry = "Technology"
        market_trends = ["AI", "Automation"]
    else:
        market_industry = market.industry
        market_trends = market.top_trends

    if competitors is None:
        comp_count = 2
    else:
        comp_count = len(competitors.competitors)
    
    # Calculate scores
    trend_signal = min(len(market_trends), 3) * 10 + 60
    comp_penalty = max(0, comp_count - 1) * 5
    feasibility = max(0, min(100, trend_signal - comp_penalty))
    
    novelty = max(0, min(100, 80 - (comp_count * 10)))
    
    industry_lower = market_industry.lower()
    if "health" in industry_lower or "finance" in industry_lower:
        readiness = "Medium"
    elif comp_count <= 1:
        readiness = "Low"
    else:
        readiness = "High"
    
    return ValidationScore(
        feasibility_score=feasibility,
        novelty_score=novelty,
        market_readiness=readiness,
    )


def score_validation(
    market: Optional[MarketInsight] = None, 
    competitors: Optional[CompetitorSnapshot] = None,
    idea: Optional[RefinedIdea] = None
) -> ValidationScore:
    """
    Score startup idea using AI analysis with algorithmic fallback.
    
    Algorithm:
    1. Try OpenRouter API for intelligent scoring
    2. If successful, parse AI response for scores and reasoning
    3. If fails, use algorithmic calculation based on:
       - Number of market trends (more = higher feasibility)
       - Number of competitors (fewer = higher novelty)
       - Industry type (health/finance = medium readiness)
    
    API: OpenRouter (Mistral-7B)
    Fallback: Algorithmic scoring
    """
    api_key = settings.openrouter_api_key
    if not api_key or len(api_key) < 20:
        print("[INFO] Validation using algorithmic scoring (no API key)")
        return _algorithmic_score(market, competitors)

    try:
        client = OpenAI(
            base_url=settings.openrouter_base_url,
            api_key=api_key,
        )
        
        # Build context from available data
        context_parts = []
        
        if idea:
            context_parts.append(f"Startup: {idea.name}")
            context_parts.append(f"Problem: {idea.problem}")
            context_parts.append(f"Solution: {idea.solution}")
        
        if market:
            context_parts.append(f"Industry: {market.industry}")
            context_parts.append(f"Trends: {', '.join(market.top_trends)}")
            context_parts.append(f"Segments: {', '.join(market.customer_segments)}")
        
        if competitors:
            comp_names = [c.name for c in competitors.competitors]
            context_parts.append(f"Competitors: {', '.join(comp_names)}")
            context_parts.append(f"Market Gap: {competitors.market_gap}")
        
        prompt = "\n".join(context_parts)
        
        response = client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.5,
        )
        
        content = response.choices[0].message.content or ""
        
        # Parse JSON response
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = content[start_idx:end_idx]
            payload = json.loads(json_str)
            
            print("[INFO] Validation scored using AI")
            return ValidationScore(
                feasibility_score=int(payload.get("feasibility_score", 70)),
                novelty_score=int(payload.get("novelty_score", 65)),
                market_readiness=payload.get("market_readiness", "Medium"),
            )
            
    except Exception as e:
        print(f"[WARN] AI validation failed: {e}, using algorithmic fallback")
    
    return _algorithmic_score(market, competitors)
