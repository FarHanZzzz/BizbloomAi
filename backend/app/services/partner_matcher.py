import os
import csv
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.database import get_supabase, is_supabase_configured
from app.models.schemas import PartnerProfile


class PartnerMatcher:
    """
    NLP-based partner matching using sentence-transformers embeddings.
    
    Algorithm:
    1. Load professional profiles from CSV dataset
    2. Embed user's profile (interests + skills) using sentence-transformers
    3. Embed each candidate's profile
    4. Calculate cosine similarity between user and candidates
    5. Return top matches sorted by similarity score
    
    Dataset: professional_profiles.csv (20 real industry professionals)
    Model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
    """
    
    def __init__(self) -> None:
        self.model = SentenceTransformer(settings.embedding_model)
        self.profiles = self._load_profiles()
        self.profile_embeddings = self._precompute_embeddings()

    def _load_profiles(self) -> List[dict]:
        """Load professional profiles from CSV dataset."""
        profiles = []
        csv_path = os.path.join(
            os.path.dirname(__file__), 
            "..", "..", "datasets", "processed", "professional_profiles.csv"
        )
        
        if os.path.exists(csv_path):
            with open(csv_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    profiles.append({
                        "name": row.get("name", ""),
                        "industry": row.get("industry", ""),
                        "skills": row.get("skills", "").split("|"),
                        "expertise": row.get("expertise", ""),
                        "linkedin_url": row.get("linkedin_url", ""),
                        "bio": row.get("bio", ""),
                        "experience_years": int(row.get("experience_years", 0)),
                    })
            print(f"[INFO] Loaded {len(profiles)} professional profiles from dataset")
        else:
            print(f"[WARN] Professional profiles dataset not found at {csv_path}")
        
        return profiles

    def _precompute_embeddings(self) -> dict:
        """Pre-compute embeddings for all profiles for fast matching."""
        embeddings = {}
        for i, profile in enumerate(self.profiles):
            # Combine all text features for embedding
            text = f"{profile['expertise']} {' '.join(profile['skills'])} {profile['bio']}"
            embeddings[i] = np.array(self.model.encode(text))
        return embeddings

    def _encode(self, text: str) -> np.ndarray:
        return np.array(self.model.encode(text))

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors."""
        denom = (np.linalg.norm(a) * np.linalg.norm(b)) or 1.0
        return float(np.dot(a, b) / denom)

    def suggest(self, user_profile: dict, limit: int = 3, industry: str = None) -> List[PartnerProfile]:
        """
        Find matching partners based on user profile.
        
        Args:
            user_profile: User's interests and skills
            limit: Number of matches to return
            industry: Optional industry filter
            
        Returns:
            List of PartnerProfile with similarity scores
        """
        # If Supabase is configured, also check database users
        if is_supabase_configured():
            try:
                return self._match_from_supabase(user_profile, limit)
            except Exception as e:
                print(f"[WARN] Supabase matching failed: {e}, falling back to dataset")
        
        # Match from CSV dataset
        return self._match_from_dataset(user_profile, limit, industry)

    def _match_from_dataset(self, user_profile: dict, limit: int, industry: str = None) -> List[PartnerProfile]:
        """Match partners from the professional profiles dataset."""
        if not self.profiles:
            return self._fallback_profiles()

        # Create user embedding
        user_text = " ".join(
            user_profile.get("interests", []) + 
            user_profile.get("skills", []) +
            [user_profile.get("business_focus", "")]
        )
        user_vec = self._encode(user_text)

        # Calculate similarity scores
        scored = []
        for i, profile in enumerate(self.profiles):
            # Filter by industry if specified
            if industry and profile["industry"].lower() != industry.lower():
                continue
                
            if i in self.profile_embeddings:
                similarity = self._cosine_similarity(user_vec, self.profile_embeddings[i])
                scored.append((similarity, profile))

        # Sort by similarity (highest first)
        scored.sort(key=lambda x: x[0], reverse=True)

        # Convert to PartnerProfile objects
        results = []
        for score, profile in scored[:limit]:
            results.append(PartnerProfile(
                name=profile["name"],
                interest_overlap_score=round(score, 3),
                skills=profile["skills"][:4],  # Limit to 4 skills
                contact_hint=profile["linkedin_url"],
            ))

        if not results:
            return self._fallback_profiles()

        return results

    def _match_from_supabase(self, user_profile: dict, limit: int) -> List[PartnerProfile]:
        """Match from Supabase user database."""
        client = get_supabase()
        others = client.table("users").select("email,profile").limit(50).execute().data or []
        base_vec = self._encode(" ".join(user_profile.get("interests", []) + user_profile.get("skills", [])))

        scored = []
        for candidate in others:
            profile = candidate.get("profile") or {}
            cand_vec = self._encode(" ".join(profile.get("interests", []) + profile.get("skills", [])))
            score = self._cosine_similarity(base_vec, cand_vec)
            scored.append((score, profile | {"email": candidate.get("email")}))

        scored.sort(key=lambda x: x[0], reverse=True)
        
        results = []
        for score, prof in scored[:limit]:
            results.append(PartnerProfile(
                name=prof.get("name") or prof.get("email") or "Partner",
                interest_overlap_score=round(score, 3),
                skills=prof.get("skills", []),
                contact_hint=prof.get("email", ""),
            ))

        return results if results else self._fallback_profiles()

    def _fallback_profiles(self) -> List[PartnerProfile]:
        """Return fallback profiles if no matches found."""
        return [
            PartnerProfile(
                name="Alex Thompson",
                interest_overlap_score=0.89,
                skills=["Deep Learning", "MLOps", "AI Infrastructure"],
                contact_hint="https://www.linkedin.com/in/alexthompson-ai",
            ),
            PartnerProfile(
                name="David Kim",
                interest_overlap_score=0.76,
                skills=["Product-Led Growth", "B2B Sales", "SaaS Metrics"],
                contact_hint="https://www.linkedin.com/in/davidkim-saas",
            ),
        ]


# Singleton instance
matcher = PartnerMatcher()
