export interface PredictionResult {
  index: number;
  prediction: 0 | 1;
  probability: number;
  amount: number;
}

export interface BatchResponse {
  predictions: PredictionResult[];
  summary: {
    total: number;
    fraud_count: number;
    legit_count: number;
    fraud_rate: number;
  };
}
