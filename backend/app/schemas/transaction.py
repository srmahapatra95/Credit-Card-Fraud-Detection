from pydantic import BaseModel


class PredictionResult(BaseModel):
    index: int
    prediction: int
    probability: float
    amount: float


class Summary(BaseModel):
    total: int
    fraud_count: int
    legit_count: int
    fraud_rate: float


class BatchResponse(BaseModel):
    predictions: list[PredictionResult]
    summary: Summary
