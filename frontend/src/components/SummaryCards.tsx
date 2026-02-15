import { Activity, ShieldAlert, ShieldCheck, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SummaryCardsProps {
  summary: {
    total: number;
    fraud_count: number;
    legit_count: number;
    fraud_rate: number;
  };
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards: { label: string; value: string | number; color: string; icon: LucideIcon }[] = [
    { label: "Total Transactions", value: summary.total, color: "text-foreground", icon: Activity },
    { label: "Fraud Detected", value: summary.fraud_count, color: "text-red-500", icon: ShieldAlert },
    { label: "Legitimate", value: summary.legit_count, color: "text-green-500", icon: ShieldCheck },
    { label: "Fraud Rate", value: `${summary.fraud_rate.toFixed(2)}%`, color: "text-orange-500", icon: Percent },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
