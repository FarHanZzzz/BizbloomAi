# Datasets

Place the Kaggle CSVs you provided into this folder before running the processor:
- business-ideas-generated-with-gpt3.csv
- startup-success-prediction.csv
- global-startup-success-dataset.csv

Then run:
```
python backend/scripts/process_datasets.py
```

Processed outputs (embeddings + metadata) are written to `datasets/processed/`.

