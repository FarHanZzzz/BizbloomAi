import json
from openai import OpenAI

from app.config import settings
from app.models.schemas import RefinedIdea, RiskOpportunity


SYSTEM_PROMPT = """You are a startup risk analyst. Analyze the startup idea thoroughly.
Return JSON with:
- opportunities: array of 2 DETAILED opportunity strings (each 20-30 words explaining the opportunity)
- risks: array of 2 DETAILED risk strings (each 20-30 words explaining the risk)  
- mitigation: detailed mitigation strategy string (30-50 words)

Be specific to the industry and idea. Provide actionable, detailed insights."""


def _fallback_risks(idea: RefinedIdea = None) -> RiskOpportunity:
    return RiskOpportunity(
        opportunities=[
            "Strong market timing as digital transformation accelerates - early entrants can capture significant market share before incumbents adapt.",
            "Opportunity to build network effects early - first-mover advantage in community building creates defensible moat against competitors.",
        ],
        risks=[
            "Customer acquisition costs may be higher than projected during early stages - requires careful budget allocation and channel testing.",
            "Incumbent players with existing distribution could launch competing features quickly - need strong differentiation strategy.",
        ],
        mitigation="Start with a focused pilot program targeting early adopters. Validate product-market fit with 50-100 users before scaling. Build partnerships with industry influencers for organic growth.",
    )


def assess_risks(idea: RefinedIdea) -> RiskOpportunity:
    api_key = settings.openrouter_api_key
    if not api_key or api_key.startswith("sk-or-your") or len(api_key) < 20:
        return _fallback_risks(idea)

    try:
        client = OpenAI(
            base_url=settings.openrouter_base_url,
            api_key=api_key,
        )
        
        prompt = f"""Analyze this startup idea in detail:

Startup: {idea.name}
Problem: {idea.problem}
Solution: {idea.solution}
Value Proposition: {idea.value_proposition}

Provide detailed, actionable opportunities and risks specific to this idea.
Each opportunity and risk should be 20-30 words explaining the context.
Mitigation should be 30-50 words with specific action items."""
        
        response = client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=700,
            temperature=0.6,
        )
        
        content = response.choices[0].message.content or ""
        
        try:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                payload = json.loads(json_str)
                return RiskOpportunity(
                    opportunities=payload.get("opportunities", [])[:2] or _fallback_risks().opportunities,
                    risks=payload.get("risks", [])[:2] or _fallback_risks().risks,
                    mitigation=payload.get("mitigation", "") or _fallback_risks().mitigation,
                )
        except Exception as e:
            print(f"[WARN] Risk JSON parsing failed: {e}")
            return _fallback_risks(idea)
            
    except Exception as e:
        print(f"[ERROR] Risk assessment OpenRouter error: {e}")
        return _fallback_risks(idea)
