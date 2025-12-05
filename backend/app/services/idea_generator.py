from typing import List

from openai import OpenAI

from app.config import settings
from app.models.schemas import RefinedIdea


SYSTEM_PROMPT = """You generate exactly 3 refined startup ideas from a short user idea.
Return STRICT JSON with keys: ideas -> list of 3 objects, each with name, problem, solution, value_proposition.
No commentary. Keep sentences concise."""


def generate_refined_ideas(user_input: str) -> List[RefinedIdea]:
    if not settings.openai_api_key:
        # Offline fallback for development
        return [
            RefinedIdea(
                name="Idea Alpha",
                problem="Users struggle to validate ideas quickly.",
                solution="AI generates structured startup briefs with risks and competitors.",
                value_proposition="Faster validation with grounded insights in minutes.",
            ),
            RefinedIdea(
                name="Idea Beta",
                problem="Founders lack concise market snapshots.",
                solution="Summaries with industry, trends, and gaps from public data.",
                value_proposition="Actionable clarity for early market moves.",
            ),
            RefinedIdea(
                name="Idea Gamma",
                problem="Teams need quick partner matches.",
                solution="Profile-based matching of complementary founders.",
                value_proposition="Better teaming via skill and interest overlap.",
            ),
        ]

    client = OpenAI(api_key=settings.openai_api_key)
    completion = client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input},
        ],
        temperature=0.2,
    )
    content = completion.choices[0].message.content
    # Defensive parsing to structured Pydantic objects
    import json

    try:
        payload = json.loads(content)
        ideas_raw = payload.get("ideas", [])
        refined = [RefinedIdea(**idea) for idea in ideas_raw][:3]
        if len(refined) == 3:
            return refined
    except Exception:
        pass

    # Fallback to first 3 parsed lines if JSON failed
    fallback = []
    for idx in range(3):
        fallback.append(
            RefinedIdea(
                name=f"Idea {idx+1}",
                problem="Problem unavailable due to parsing error.",
                solution="Solution unavailable due to parsing error.",
                value_proposition="Value proposition unavailable.",
            )
        )
    return fallback

