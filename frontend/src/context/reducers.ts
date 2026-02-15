import type { BatchResponse } from "@/types/prediction";
import type { PredictionAction } from "./actions";

export interface PredictionState {
  results: BatchResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: PredictionState = {
  results: null,
  loading: false,
  error: null,
};

export function predictionReducer(
  state: PredictionState,
  action: PredictionAction
): PredictionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_RESULTS":
      return { ...state, loading: false, results: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_RESULTS":
      return { ...state, results: null, error: null };
    default:
      return state;
  }
}
