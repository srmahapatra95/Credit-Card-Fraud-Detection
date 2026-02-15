import { Link } from "react-router-dom";
import { Upload, Zap, BarChart3, ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Credit Card Fraud Detection
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload transaction data and detect fraudulent activity using an
          XGBoost model trained on 284K+ transactions with 83% precision and
          84% recall.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="rounded-lg border bg-card p-6 space-y-2">
          <Upload className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Upload CSV</h3>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with transaction features (V1-V28, Scaled_Amount,
            Scaled_Time) for batch prediction.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Instant Results</h3>
          <p className="text-sm text-muted-foreground">
            Get fraud probability for each transaction with a tuned 0.6
            threshold for optimal precision-recall balance.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Visual Insights</h3>
          <p className="text-sm text-muted-foreground">
            View summary stats, probability distributions, and a sortable
            results table with fraud/legit tags.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/demo"
          className="flex items-center gap-2 rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent"
        >
          <Play className="h-4 w-4" />
          Try Demo
        </Link>
      </div>
    </div>
  );
}
