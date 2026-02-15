import io

import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.config import FEATURE_COLUMNS, SAMPLE_CSV_PATH
from app.dependencies import get_current_user
from app.models import User
from app.schemas.transaction import BatchResponse, PredictionResult, Summary
from app.services.model import predict_batch

router = APIRouter()


def build_response(results: list[dict]) -> BatchResponse:
    predictions = [PredictionResult(**r) for r in results]
    fraud_count = sum(1 for r in results if r["prediction"] == 1)
    total = len(results)

    return BatchResponse(
        predictions=predictions,
        summary=Summary(
            total=total,
            fraud_count=fraud_count,
            legit_count=total - fraud_count,
            fraud_rate=(fraud_count / total * 100) if total > 0 else 0,
        ),
    )


@router.post("/predict/batch", response_model=BatchResponse)
async def predict_batch_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not parse CSV file")

    missing = [col for col in FEATURE_COLUMNS if col not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing columns: {', '.join(missing)}",
        )

    results = predict_batch(df)
    return build_response(results)


@router.get("/sample", response_model=BatchResponse)
async def sample_endpoint(
    current_user: User = Depends(get_current_user),
):
    if not SAMPLE_CSV_PATH.exists():
        raise HTTPException(status_code=404, detail="Sample data not found")

    df = pd.read_csv(SAMPLE_CSV_PATH)
    results = predict_batch(df)
    return build_response(results)
