from typing import List
import json
from openai import OpenAI

from app.config import settings
from app.models.schemas import RefinedIdea


SYSTEM_PROMPT = """You generate exactly 3 refined startup ideas from a short user idea.
Return STRICT JSON with keys: ideas -> list of 3 objects, each with name, problem, solution, value_proposition.
No commentary. Keep sentences concise. Example format:
{"ideas": [{"name": "StartupName", "problem": "Problem statement", "solution": "Solution description", "value_proposition": "Value prop"}]}"""


def _fallback_ideas() -> List[RefinedIdea]:
    """Return demo ideas when API is unavailable."""
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


def generate_refined_ideas(user_input: str) -> List[RefinedIdea]:
    # Check if API key is missing or placeholder
    api_key = settings.openrouter_api_key
    if not api_key or api_key.startswith("sk-or-your") or len(api_key) < 20:
        print("[INFO] No valid OpenRouter API key, using fallback ideas")
        return _fallback_ideas()

    try:
        print(f"[INFO] Calling OpenRouter API with model: {settings.openrouter_model}")
        
        client = OpenAI(
            base_url=settings.openrouter_base_url,
            api_key=api_key,
        )
        
        response = client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Generate 3 startup ideas based on: {user_input}\n\nReturn ONLY valid JSON."}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        content = response.choices[0].message.content or ""
        print(f"[INFO] Received response: {content[:200]}...")
        
        # Try to extract JSON from response
        try:
            # Find JSON in response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                payload = json.loads(json_str)
                ideas_raw = payload.get("ideas", [])
                refined = [RefinedIdea(**idea) for idea in ideas_raw][:3]
                if len(refined) >= 1:
                    print(f"[INFO] Successfully parsed {len(refined)} ideas from API response")
                    # Pad with fallback if needed
                    while len(refined) < 3:
                        refined.append(_fallback_ideas()[len(refined)])
                    return refined
        except Exception as e:
            print(f"[WARN] JSON parsing failed: {e}")

        # Fallback to demo ideas if parsing failed
        print("[WARN] Failed to parse response, using fallback ideas")
        return _fallback_ideas()
        
    except Exception as e:
        print(f"[ERROR] OpenRouter API error: {e}")
        return _fallback_ideas()
