import { useEffect } from "react";
import { usePrediction } from "@/context/PredictionContext";
import { setLoading, setResults, setError } from "@/context/actions";
import { fetchSample } from "@/api/predict";
import { Play, Loader2, AlertCircle } from "lucide-react";
import SummaryCards from "@/components/SummaryCards";
import ResultsTable from "@/components/ResultsTable";
import ProbabilityChart from "@/components/ProbabilityChart";

export default function Demo() {
  const { state, dispatch } = usePrediction();

  useEffect(() => {
    const loadSample = async () => {
      try {
        dispatch(setLoading());
        const data = await fetchSample();
        dispatch(setResults(data));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to load sample data"));
      }
    };

    loadSample();
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Play className="h-6 w-6" />
          Demo
        </h2>
        <p className="text-muted-foreground mt-1">
          Pre-loaded sample transactions (15 fraud + 35 legitimate) from the test set.
        </p>
      </div>

      {state.loading && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading sample data...
        </p>
      )}

      {state.error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      {state.results && (
        <>
          <SummaryCards summary={state.results.summary} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProbabilityChart predictions={state.results.predictions} />
          </div>
          <ResultsTable predictions={state.results.predictions} />
        </>
      )}
    </div>
  );
}
