from typing import List

from openai import OpenAI

from app.config import settings
from app.models.schemas import RefinedIdea, RiskOpportunity


PROMPT = """Generate risks/opportunities for the idea.
Return JSON with keys: opportunities (2 short bullets <=15 words), risks (2 bullets <=15 words), mitigation (1 bullet <=15 words).
No commentary."""


def _fallback_risks() -> RiskOpportunity:
    return RiskOpportunity(
        opportunities=[
            "Ride AI adoption wave",
            "Early mover in niche",
        ],
        risks=[
            "Data quality issues",
            "Competitive fast followers",
        ],
        mitigation="Pilot with small cohort; refine quickly",
    )


def assess_risks(idea: RefinedIdea) -> RiskOpportunity:
    api_key = settings.openai_api_key
    if not api_key or api_key.startswith("your-") or len(api_key) < 20:
        return _fallback_risks()

    try:
        client = OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model=settings.model_name,
            messages=[
                {"role": "system", "content": PROMPT},
                {
                    "role": "user",
                    "content": f"Name: {idea.name}\nProblem: {idea.problem}\nSolution: {idea.solution}\nValue: {idea.value_proposition}",
                },
            ],
            temperature=0.3,
        )
        import json

        try:
            payload = json.loads(completion.choices[0].message.content)
            return RiskOpportunity(
                opportunities=payload.get("opportunities", [])[:2],
                risks=payload.get("risks", [])[:2],
                mitigation=payload.get("mitigation", ""),
            )
        except Exception:
            return RiskOpportunity(
                opportunities=["Growing market", "Strong differentiation"],
                risks=["Execution risk", "Market timing risk"],
                mitigation="Phase launches; validate with early users",
            )
    except Exception:
        return _fallback_risks()

