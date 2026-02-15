import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { PredictionResult } from "@/types/prediction";
import { BarChart3 } from "lucide-react";

interface ProbabilityChartProps {
  predictions: PredictionResult[];
}

export default function ProbabilityChart({ predictions }: ProbabilityChartProps) {
  // Bucket probabilities into histogram bins
  const bins = Array.from({ length: 10 }, (_, i) => ({
    range: `${(i * 10)}–${(i + 1) * 10}%`,
    count: 0,
  }));

  predictions.forEach((p) => {
    const idx = Math.min(Math.floor(p.probability * 10), 9);
    bins[idx]!.count++;
  });

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
        <BarChart3 className="h-4 w-4" />
        Fraud Probability Distribution
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={bins}>
          <XAxis dataKey="range" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <ReferenceLine x="60–70%" stroke="red" strokeDasharray="3 3" label="Threshold" />
          <Bar dataKey="count" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
