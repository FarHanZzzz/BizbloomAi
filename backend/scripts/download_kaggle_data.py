#!/usr/bin/env python3
"""
Kaggle Startup Dataset Downloader & Processor
Downloads startup data and creates FAISS index for competitor analysis.

Usage:
    python download_kaggle_data.py

Requirements:
    - kaggle package (pip install kaggle)
    - kaggle.json in ~/.kaggle/ with your credentials
    
Alternative: Run without Kaggle credentials to use embedded sample data.
"""

import os
import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import faiss
    from sentence_transformers import SentenceTransformer
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False
    print("Warning: faiss-cpu not installed. Run: pip install faiss-cpu")


# Sample startup dataset for demo (when Kaggle is unavailable)
SAMPLE_STARTUPS = [
    {"name": "Duolingo", "category": "EdTech", "description": "AI-powered language learning platform with gamification", "funding": "Series F"},
    {"name": "Coursera", "category": "EdTech", "description": "Online learning platform offering courses from top universities", "funding": "IPO"},
    {"name": "Khan Academy", "category": "EdTech", "description": "Free educational content and personalized learning tools", "funding": "Non-profit"},
    {"name": "Stripe", "category": "FinTech", "description": "Payment processing platform for internet businesses", "funding": "Series I"},
    {"name": "Plaid", "category": "FinTech", "description": "Financial infrastructure connecting apps to bank accounts", "funding": "Series D"},
    {"name": "Robinhood", "category": "FinTech", "description": "Commission-free stock trading mobile app", "funding": "IPO"},
    {"name": "Oscar Health", "category": "HealthTech", "description": "Technology-focused health insurance company", "funding": "IPO"},
    {"name": "Teladoc", "category": "HealthTech", "description": "Virtual healthcare platform for remote consultations", "funding": "IPO"},
    {"name": "Headspace", "category": "HealthTech", "description": "Mental health and meditation app", "funding": "Series C"},
    {"name": "Notion", "category": "Productivity", "description": "All-in-one workspace for notes, docs, and collaboration", "funding": "Series C"},
    {"name": "Figma", "category": "Design", "description": "Collaborative interface design tool in the browser", "funding": "Acquired"},
    {"name": "Canva", "category": "Design", "description": "Online graphic design platform with templates", "funding": "Series E"},
    {"name": "Grammarly", "category": "AI Writing", "description": "AI-powered writing assistant for grammar and clarity", "funding": "Series E"},
    {"name": "Jasper AI", "category": "AI Writing", "description": "AI content creation platform for marketing teams", "funding": "Series A"},
    {"name": "Loom", "category": "Communication", "description": "Video messaging platform for async communication", "funding": "Series C"},
    {"name": "Calendly", "category": "Productivity", "description": "Automated scheduling tool for meetings", "funding": "Series C"},
    {"name": "Airtable", "category": "Productivity", "description": "Spreadsheet-database hybrid for team collaboration", "funding": "Series F"},
    {"name": "Webflow", "category": "Design", "description": "No-code website builder with CMS capabilities", "funding": "Series C"},
    {"name": "Vercel", "category": "Developer Tools", "description": "Frontend cloud platform for Next.js deployment", "funding": "Series D"},
    {"name": "GitHub Copilot", "category": "Developer Tools", "description": "AI pair programmer suggesting code completions", "funding": "Microsoft"},
    {"name": "Uber Eats", "category": "FoodTech", "description": "Food delivery platform from local restaurants", "funding": "IPO"},
    {"name": "DoorDash", "category": "FoodTech", "description": "On-demand food delivery service", "funding": "IPO"},
    {"name": "Instacart", "category": "FoodTech", "description": "Grocery delivery and pick-up service", "funding": "IPO"},
    {"name": "Airbnb", "category": "Travel", "description": "Online marketplace for lodging and tourism", "funding": "IPO"},
    {"name": "Booking.com", "category": "Travel", "description": "Travel fare aggregator and metasearch engine", "funding": "Public"},
    {"name": "Shopify", "category": "E-commerce", "description": "E-commerce platform for online stores", "funding": "IPO"},
    {"name": "Square", "category": "FinTech", "description": "Financial services and payment solutions", "funding": "IPO"},
    {"name": "Zoom", "category": "Communication", "description": "Video conferencing and communication platform", "funding": "IPO"},
    {"name": "Slack", "category": "Communication", "description": "Business communication and collaboration hub", "funding": "Acquired"},
    {"name": "Discord", "category": "Communication", "description": "Voice, video, and text communication platform", "funding": "Series H"},
    {"name": "MongoDB", "category": "Developer Tools", "description": "NoSQL document database platform", "funding": "IPO"},
    {"name": "Snowflake", "category": "Data", "description": "Cloud data warehouse and analytics platform", "funding": "IPO"},
    {"name": "Databricks", "category": "Data", "description": "Unified analytics platform for data engineering", "funding": "Series H"},
    {"name": "Palantir", "category": "Data", "description": "Big data analytics platforms for enterprises", "funding": "IPO"},
    {"name": "Scale AI", "category": "AI Infrastructure", "description": "Data labeling and AI training platform", "funding": "Series E"},
    {"name": "Hugging Face", "category": "AI Infrastructure", "description": "Open-source AI model hub and tools", "funding": "Series D"},
    {"name": "OpenAI", "category": "AI Infrastructure", "description": "AI research lab developing GPT models", "funding": "Series Unknown"},
    {"name": "Anthropic", "category": "AI Infrastructure", "description": "AI safety company building Claude assistant", "funding": "Series C"},
    {"name": "Midjourney", "category": "AI Tools", "description": "AI image generation from text prompts", "funding": "Self-funded"},
    {"name": "Runway", "category": "AI Tools", "description": "AI video editing and generation platform", "funding": "Series C"},
]

# Industry trend signals for market insights
TREND_SIGNALS = [
    {"industry": "EdTech", "trend": "AI-powered personalized learning"},
    {"industry": "EdTech", "trend": "Microlearning and mobile-first education"},
    {"industry": "EdTech", "trend": "Skills-based credentials over degrees"},
    {"industry": "FinTech", "trend": "Embedded finance in non-financial apps"},
    {"industry": "FinTech", "trend": "Real-time payments and instant transfers"},
    {"industry": "FinTech", "trend": "AI-driven fraud detection"},
    {"industry": "HealthTech", "trend": "Remote patient monitoring"},
    {"industry": "HealthTech", "trend": "Mental health digital therapeutics"},
    {"industry": "HealthTech", "trend": "AI diagnostics and imaging"},
    {"industry": "Productivity", "trend": "AI copilots for workflows"},
    {"industry": "Productivity", "trend": "Async-first collaboration tools"},
    {"industry": "Developer Tools", "trend": "AI code generation and review"},
    {"industry": "Developer Tools", "trend": "Low-code/no-code platforms"},
    {"industry": "AI Infrastructure", "trend": "Open-source foundation models"},
    {"industry": "AI Infrastructure", "trend": "Edge AI deployment"},
    {"industry": "AI Tools", "trend": "Generative AI for creative work"},
    {"industry": "AI Tools", "trend": "AI agents and automation"},
    {"industry": "FoodTech", "trend": "Ghost kitchens and virtual brands"},
    {"industry": "FoodTech", "trend": "Sustainable food alternatives"},
    {"industry": "E-commerce", "trend": "Social commerce and live shopping"},
    {"industry": "E-commerce", "trend": "AI-powered recommendations"},
    {"industry": "Communication", "trend": "Async video messaging"},
    {"industry": "Communication", "trend": "AI meeting summaries"},
    {"industry": "Design", "trend": "AI-assisted design tools"},
    {"industry": "Design", "trend": "Real-time collaboration"},
    {"industry": "Data", "trend": "Data mesh architecture"},
    {"industry": "Data", "trend": "Real-time data streaming"},
]


def download_kaggle_dataset():
    """Try to download startup dataset from Kaggle."""
    try:
        import kaggle
        
        # Download Crunchbase startup dataset
        dataset_name = "arindam235/startup-investments-crunchbase"
        output_path = Path(__file__).parent.parent.parent / "datasets" / "raw"
        output_path.mkdir(parents=True, exist_ok=True)
        
        print(f"Downloading {dataset_name}...")
        kaggle.api.dataset_download_files(dataset_name, path=str(output_path), unzip=True)
        
        # Look for the CSV file
        csv_files = list(output_path.glob("*.csv"))
        if csv_files:
            df = pd.read_csv(csv_files[0])
            return df
            
    except Exception as e:
        print(f"Kaggle download failed: {e}")
        print("Using embedded sample startup data instead.")
    
    return None


def create_startup_index():
    """Create FAISS index from startup data for competitor search."""
    processed_dir = Path(__file__).parent.parent.parent / "datasets" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    # Try Kaggle first, fallback to sample data
    kaggle_df = download_kaggle_dataset()
    
    if kaggle_df is not None and 'name' in kaggle_df.columns:
        # Process Kaggle data
        startups = []
        for _, row in kaggle_df.head(100).iterrows():
            startups.append({
                "name": str(row.get('name', 'Unknown')),
                "category": str(row.get('category_list', row.get('market', 'General'))),
                "description": str(row.get('short_description', row.get('description', 'N/A'))),
                "url": str(row.get('homepage_url', ''))
            })
    else:
        # Use sample data
        startups = SAMPLE_STARTUPS
    
    # Create DataFrame
    df = pd.DataFrame(startups)
    
    # Save metadata CSV
    metadata_path = processed_dir / "startup_metadata.csv"
    df.to_csv(metadata_path, index=False)
    print(f"Saved metadata to {metadata_path}")
    
    # Create trend signals CSV
    trends_df = pd.DataFrame(TREND_SIGNALS)
    trends_path = processed_dir / "trend_signals.csv"
    trends_df.to_csv(trends_path, index=False)
    print(f"Saved trend signals to {trends_path}")
    
    # Create FAISS index if available
    if FAISS_AVAILABLE:
        print("Creating FAISS index for competitor search...")
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        # Create embeddings from startup descriptions
        texts = [f"{s.get('name', '')} {s.get('category', '')} {s.get('description', '')}" for s in startups]
        embeddings = model.encode(texts, show_progress_bar=True)
        embeddings = np.array(embeddings).astype('float32')
        
        # Create and save FAISS index
        dim = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)  # Inner product = cosine similarity for normalized vectors
        faiss.normalize_L2(embeddings)
        index.add(embeddings)
        
        index_path = processed_dir / "startup_index.faiss"
        faiss.write_index(index, str(index_path))
        print(f"Saved FAISS index to {index_path}")
    else:
        print("Skipping FAISS index creation (faiss-cpu not installed)")
    
    print(f"\n✅ Dataset processing complete!")
    print(f"   - {len(startups)} startups indexed")
    print(f"   - {len(TREND_SIGNALS)} trend signals saved")
    
    return True


if __name__ == "__main__":
    create_startup_index()
