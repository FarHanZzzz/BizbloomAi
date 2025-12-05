from typing import List, Tuple

import numpy as np
import pandas as pd
from annoy import AnnoyIndex
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.models.schemas import Competitor, CompetitorSnapshot, RefinedIdea


class CompetitorIndex:
    def __init__(self) -> None:
        self.model = SentenceTransformer(settings.embedding_model)
        self.index = None
        self.metadata: List[dict] = []
        self.dim = self.model.get_sentence_embedding_dimension()

    def load(self) -> None:
        index_path = f"{settings.processed_dir}/startup_index.ann"
        meta_path = f"{settings.processed_dir}/startup_metadata.csv"
        try:
            self.index = AnnoyIndex(self.dim, "angular")
            self.index.load(index_path)
            self.metadata = pd.read_csv(meta_path).to_dict(orient="records")
        except FileNotFoundError:
            self.index = None
            self.metadata = []

    def query(self, text: str, k: int = 2) -> List[Tuple[int, float]]:
        if self.index is None:
            return []
        vec = self.model.encode(text)
        ids, distances = self.index.get_nns_by_vector(vec, k, include_distances=True)
        return list(zip(ids, distances))


_global_index: CompetitorIndex | None = None


def get_index() -> CompetitorIndex:
    global _global_index
    if _global_index is None:
        _global_index = CompetitorIndex()
        _global_index.load()
    return _global_index


def competitor_snapshot(idea: RefinedIdea) -> CompetitorSnapshot:
    idx = get_index()
    query_text = " ".join([idea.name, idea.problem, idea.solution, idea.value_proposition])
    matches = idx.query(query_text, k=2)

    competitors: List[Competitor] = []
    for match_id, _dist in matches:
        if idx.metadata and 0 <= match_id < len(idx.metadata):
            entry = idx.metadata[match_id]
            competitors.append(
                Competitor(
                    name=entry.get("name", "Unknown"),
                    short_description=entry.get("description", "N/A"),
                    url_if_known=entry.get("url", None),
                )
            )

    if not competitors:
        competitors = [
            Competitor(
                name="BenchmarkCo",
                short_description="Reference competitor placeholder.",
                url_if_known=None,
            )
        ]

    market_gap = "Differentiate with sharper positioning or niche focus."
    if competitors:
        market_gap = "Exploit underserved niche or feature gaps versus nearest rivals."

    return CompetitorSnapshot(competitors=competitors[:2], market_gap=market_gap)

