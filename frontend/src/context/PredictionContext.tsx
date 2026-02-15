import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { predictionReducer, initialState, type PredictionState } from "./reducers";
import type { PredictionAction } from "./actions";

interface PredictionContextType {
  state: PredictionState;
  dispatch: Dispatch<PredictionAction>;
}

const PredictionContext = createContext<PredictionContextType | null>(null);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(predictionReducer, initialState);

  return (
    <PredictionContext.Provider value={{ state, dispatch }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
}
