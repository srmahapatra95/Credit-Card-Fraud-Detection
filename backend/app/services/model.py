import joblib
import numpy as np
import pandas as pd

from app.config import MODEL_PATH, FEATURE_COLUMNS

_artifact: dict | None = None


def load_model() -> dict:
    global _artifact
    if _artifact is None:
        _artifact = joblib.load(MODEL_PATH)
    return _artifact


def predict_batch(df: pd.DataFrame) -> list[dict]:
    artifact = load_model()
    model = artifact["model"]
    threshold = artifact["threshold"]
    amount_scaler = artifact["amount_scaler"]

    X = df[FEATURE_COLUMNS]
    probabilities = model.predict_proba(X)[:, 1]
    predictions = (probabilities >= threshold).astype(int)

    original_amounts = amount_scaler.inverse_transform(
        X["Scaled_Amount"].values.reshape(-1, 1)
    ).flatten()

    results = []
    for i in range(len(df)):
        results.append({
            "index": i,
            "prediction": int(predictions[i]),
            "probability": float(probabilities[i]),
            "amount": round(float(original_amounts[i]), 2),
        })

    return results
