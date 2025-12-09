export function StatsCard({ title, value, icon: Icon, gradient, color, textColor, itemColor }) {
  // Use passed specific colors if available, otherwise fallback or use gradient logic
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
        <p className="text-4xl font-display font-bold text-foreground">{value}</p>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color ? color : gradient} ${textColor || ""} ${itemColor || ""}`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
