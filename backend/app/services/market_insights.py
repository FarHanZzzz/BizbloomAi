from typing import List

import pandas as pd

from app.config import settings
from app.models.schemas import MarketInsight, RefinedIdea


def load_trend_data() -> pd.DataFrame:
    path = f"{settings.processed_dir}/trend_signals.csv"
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        return pd.DataFrame(columns=["industry", "trend"])


def generate_market_insight(idea: RefinedIdea) -> MarketInsight:
    # Very lightweight heuristic: use simple keyword matching on processed trend file.
    df = load_trend_data()
    industry = "General"
    top_trends: List[str] = ["AI enablement", "Automation"]
    customer_segments: List[str] = ["Early adopters"]

    if not df.empty:
        # Pick the most common industry
        industry = df["industry"].mode().iloc[0]
        top_trends = df["trend"].head(2).tolist() or top_trends
        customer_segments = ["SMBs", "Enterprise"][:2]
    else:
        # fallback heuristic based on keywords
        text = " ".join([idea.problem, idea.solution, idea.value_proposition]).lower()
        if "education" in text:
            industry = "EdTech"
            top_trends = ["AI tutors", "Microlearning"]
            customer_segments = ["Students", "Schools"]
        elif "health" in text or "medical" in text:
            industry = "HealthTech"
            top_trends = ["Remote care", "Preventative analytics"]
            customer_segments = ["Clinics", "Patients"]
        elif "finance" in text or "payment" in text:
            industry = "FinTech"
            top_trends = ["Embedded finance", "Fraud prevention"]
            customer_segments = ["SMBs", "Marketplaces"]

    return MarketInsight(
        industry=industry,
        top_trends=top_trends[:2],
        customer_segments=customer_segments[:2],
    )

