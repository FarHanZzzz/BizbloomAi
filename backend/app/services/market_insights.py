from typing import List
import json

import pandas as pd
from openai import OpenAI

from app.config import settings
from app.models.schemas import MarketInsight, RefinedIdea


def load_trend_data() -> pd.DataFrame:
    path = f"{settings.processed_dir}/trend_signals.csv"
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        return pd.DataFrame(columns=["industry", "trend"])


def generate_market_insight(idea: RefinedIdea) -> MarketInsight:
    """Generate market insights using AI + dataset."""
    
    # First, try to use OpenRouter AI for intelligent analysis
    api_key = settings.openrouter_api_key
    if api_key and len(api_key) > 20 and not api_key.startswith("sk-or-your"):
        try:
            client = OpenAI(
                base_url=settings.openrouter_base_url,
                api_key=api_key,
            )
            
            prompt = f"""Analyze this startup idea and provide market insights.

Startup: {idea.name}
Problem: {idea.problem}
Solution: {idea.solution}

Return JSON with:
- industry: the main industry category (e.g., "EdTech", "FinTech", "HealthTech", "AI/ML", "SaaS", "E-commerce")
- top_trends: array of 2 relevant market trends for this industry
- customer_segments: array of 2 target customer segments

Return ONLY valid JSON."""

            response = client.chat.completions.create(
                model=settings.openrouter_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.5,
            )
            
            content = response.choices[0].message.content or ""
            
            # Parse JSON response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                payload = json.loads(json_str)
                return MarketInsight(
                    industry=payload.get("industry", "Technology"),
                    top_trends=payload.get("top_trends", ["AI enablement", "Automation"])[:2],
                    customer_segments=payload.get("customer_segments", ["SMBs", "Enterprise"])[:2],
                )
        except Exception as e:
            print(f"[WARN] AI market insight failed, using dataset: {e}")
    
    # Fallback: Use dataset + keyword matching
    df = load_trend_data()
    industry = "General"
    top_trends: List[str] = ["AI enablement", "Automation"]
    customer_segments: List[str] = ["Early adopters"]

    if not df.empty:
        # Try to match industry from dataset
        text = " ".join([idea.problem, idea.solution, idea.value_proposition]).lower()
        
        # Check for industry keywords
        industry_keywords = {
            "EdTech": ["education", "learning", "students", "school", "tutor", "course"],
            "HealthTech": ["health", "medical", "patient", "doctor", "clinic", "wellness"],
            "FinTech": ["finance", "payment", "banking", "invest", "money", "loan"],
            "AI/ML": ["ai", "machine learning", "neural", "prediction", "model"],
            "SaaS": ["software", "platform", "subscription", "service", "cloud"],
            "E-commerce": ["shop", "retail", "product", "sell", "marketplace"],
        }
        
        for ind, keywords in industry_keywords.items():
            if any(kw in text for kw in keywords):
                industry = ind
                # Get trends for this industry from dataset
                ind_trends = df[df["industry"].str.lower() == ind.lower()]["trend"].head(2).tolist()
                if ind_trends:
                    top_trends = ind_trends
                break
        
        # Set customer segments based on industry
        segment_map = {
            "EdTech": ["Students", "Educational Institutions"],
            "HealthTech": ["Healthcare Providers", "Patients"],
            "FinTech": ["SMBs", "Financial Institutions"],
            "AI/ML": ["Tech Companies", "Data Teams"],
            "SaaS": ["Startups", "Enterprise"],
            "E-commerce": ["Online Retailers", "Consumers"],
        }
        customer_segments = segment_map.get(industry, ["SMBs", "Enterprise"])
    else:
        # Pure keyword-based fallback
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
