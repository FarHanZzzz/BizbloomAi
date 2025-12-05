"""
Lightweight dataset processor for BizBloom AI.
- Expects CSVs placed under datasets/ (manual step).
- Produces embeddings index and metadata under datasets/processed/.
"""

import argparse
from pathlib import Path
from typing import List

import pandas as pd
from annoy import AnnoyIndex
from sentence_transformers import SentenceTransformer

DATASET_DIR = Path(__file__).resolve().parents[2] / "datasets"
PROCESSED_DIR = DATASET_DIR / "processed"


def load_raw_datasets() -> pd.DataFrame:
    # Try to merge known dataset filenames; adjust as needed.
    candidates = [
        "business-ideas-generated-with-gpt3.csv",
        "startup-success-prediction.csv",
        "global-startup-success-dataset.csv",
    ]
    frames: List[pd.DataFrame] = []
    for name in candidates:
        path = DATASET_DIR / name
        if path.exists():
            try:
                frames.append(pd.read_csv(path))
            except Exception:
                continue
    if not frames:
        raise FileNotFoundError("No expected dataset CSVs found in datasets/.")
    return pd.concat(frames, ignore_index=True)


def normalize(df: pd.DataFrame) -> pd.DataFrame:
    # Keep basic fields for embeddings
    df = df.rename(columns=str.lower)
    name_col = next((c for c in df.columns if "name" in c), "name")
    desc_col = next((c for c in df.columns if "description" in c or "desc" in c), "description")
    success_col = next((c for c in df.columns if "success" in c), "success_flag")
    industry_col = next((c for c in df.columns if "industry" in c), "industry")

    df["name"] = df.get(name_col, "Unknown")
    df["description"] = df.get(desc_col, "No description")
    df["success_flag"] = df.get(success_col, 0)
    df["industry"] = df.get(industry_col, "General")
    df = df[["name", "description", "success_flag", "industry"]].dropna()
    return df


def build_index(df: pd.DataFrame, model_name: str = "sentence-transformers/all-MiniLM-L6-v2") -> None:
    model = SentenceTransformer(model_name)
    dim = model.get_sentence_embedding_dimension()
    index = AnnoyIndex(dim, "angular")

    vectors = model.encode(df["description"].tolist())
    for i, vec in enumerate(vectors):
        index.add_item(i, vec.tolist())
    index.build(20)

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    index.save(str(PROCESSED_DIR / "startup_index.ann"))
    df.to_csv(PROCESSED_DIR / "startup_metadata.csv", index=False)

    # Also save simple trend signals for market insights
    trends = df.groupby("industry").head(2)[["industry", "description"]].copy()
    trends = trends.rename(columns={"description": "trend"})
    trends.to_csv(PROCESSED_DIR / "trend_signals.csv", index=False)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="sentence-transformers/all-MiniLM-L6-v2")
    args = parser.parse_args()

    df_raw = load_raw_datasets()
    df = normalize(df_raw)
    build_index(df, model_name=args.model)
    print(f"Processed {len(df)} rows. Files stored in {PROCESSED_DIR}")


if __name__ == "__main__":
    main()

