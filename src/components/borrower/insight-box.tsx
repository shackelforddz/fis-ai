interface InsightBoxProps {
  summary: string;
  metrics: { label: string; value: string }[];
}

export function InsightBox({ summary, metrics }: InsightBoxProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6 border border-border rounded-xl p-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Trend Summary</p>
        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
      </div>
      <div className="flex items-center justify-end gap-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-right">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-medium text-foreground">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
