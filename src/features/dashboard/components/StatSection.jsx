function StatSection({ title, children, action }) {
  return (
    <div className="bg-surface border border-border rounded-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default StatSection;