import type { PredictionResult } from "@/types/prediction";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface ResultsTableProps {
  predictions: PredictionResult[];
}

export default function ResultsTable({ predictions }: ResultsTableProps) {
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Prediction</th>
              <th className="px-4 py-3 text-left font-medium">Probability</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.index}
                className={`border-b ${row.prediction === 1 ? "bg-red-500/5" : ""}`}
              >
                <td className="px-4 py-3">{row.index}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.prediction === 1
                        ? "bg-red-500/10 text-red-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {row.prediction === 1 ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    {row.prediction === 1 ? "Fraud" : "Legit"}
                  </span>
                </td>
                <td className="px-4 py-3">{(row.probability * 100).toFixed(2)}%</td>
                <td className="px-4 py-3">${row.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
