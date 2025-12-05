from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.database import get_supabase, is_supabase_configured
from app.models.schemas import PartnerProfile


class PartnerMatcher:
    def __init__(self) -> None:
        self.model = SentenceTransformer(settings.embedding_model)

    def _encode(self, text: str) -> np.ndarray:
        return np.array(self.model.encode(text))

    def _overlap_score(self, a: np.ndarray, b: np.ndarray) -> float:
        denom = (np.linalg.norm(a) * np.linalg.norm(b)) or 1.0
        return float(np.dot(a, b) / denom)

    def suggest(self, user_profile: dict, limit: int = 3) -> List[PartnerProfile]:
        if not is_supabase_configured():
            # Demo mode: return placeholder partners
            return [
                PartnerProfile(
                    name="Alex Chen",
                    interest_overlap_score=0.89,
                    skills=["Product Design", "Go-To-Market"],
                    contact_hint="alex.c@demo.com",
                ),
                PartnerProfile(
                    name="Jordan Taylor",
                    interest_overlap_score=0.76,
                    skills=["Engineering", "Data Science"],
                    contact_hint="jordan.t@demo.com",
                ),
                PartnerProfile(
                    name="Sam Rivera",
                    interest_overlap_score=0.68,
                    skills=["Sales", "Business Development"],
                    contact_hint="sam.r@demo.com",
                ),
            ][:limit]

        client = get_supabase()
        others = client.table("users").select("email,profile").limit(50).execute().data or []
        base_vec = self._encode(" ".join(user_profile.get("interests", []) + user_profile.get("skills", [])))

        scored: List[tuple[float, dict]] = []
        for candidate in others:
            profile = candidate.get("profile") or {}
            cand_vec = self._encode(" ".join(profile.get("interests", []) + profile.get("skills", [])))
            score = self._overlap_score(base_vec, cand_vec)
            scored.append((score, profile | {"email": candidate.get("email")}))

        scored.sort(key=lambda x: x[0], reverse=True)
        results: List[PartnerProfile] = []
        for score, prof in scored[:limit]:
            results.append(
                PartnerProfile(
                    name=prof.get("name") or prof.get("email") or "Partner",
                    interest_overlap_score=round(score, 3),
                    skills=prof.get("skills", []),
                    contact_hint=prof.get("email", ""),
                )
            )

        if not results:
            results = [
                PartnerProfile(
                    name="Partner Placeholder",
                    interest_overlap_score=0.42,
                    skills=["Product", "Go-To-Market"],
                    contact_hint="placeholder@example.com",
                )
            ]
        return results


matcher = PartnerMatcher()

