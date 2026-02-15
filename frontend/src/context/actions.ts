import type { BatchResponse } from "@/types/prediction";

export type PredictionAction =
  | { type: "SET_LOADING" }
  | { type: "SET_RESULTS"; payload: BatchResponse }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_RESULTS" };

export const setLoading = (): PredictionAction => ({ type: "SET_LOADING" });

export const setResults = (data: BatchResponse): PredictionAction => ({
  type: "SET_RESULTS",
  payload: data,
});

export const setError = (message: string): PredictionAction => ({
  type: "SET_ERROR",
  payload: message,
});

export const clearResults = (): PredictionAction => ({ type: "CLEAR_RESULTS" });
