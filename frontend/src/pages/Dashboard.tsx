import { usePrediction } from "@/context/PredictionContext";
import { setLoading, setResults, setError, clearResults } from "@/context/actions";
import { predictBatch } from "@/api/predict";
import { LayoutDashboard, AlertCircle, Trash2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import SummaryCards from "@/components/SummaryCards";
import ResultsTable from "@/components/ResultsTable";
import ProbabilityChart from "@/components/ProbabilityChart";

export default function Dashboard() {
  const { state, dispatch } = usePrediction();

  const handleUpload = async (file: File) => {
    try {
      dispatch(setLoading());
      const data = await predictBatch(file);
      dispatch(setResults(data));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Prediction failed"));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <LayoutDashboard className="h-6 w-6" />
          Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Upload a CSV file with transaction data to detect fraud.
        </p>
      </div>

      <FileUpload onUpload={handleUpload} loading={state.loading} />

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
          <button
            onClick={() => dispatch(clearResults())}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear results
          </button>
        </>
      )}
    </div>
  );
}
