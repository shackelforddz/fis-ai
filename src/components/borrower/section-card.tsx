interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="border border-border rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
