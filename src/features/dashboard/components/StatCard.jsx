function StatCard({ label, value, suffix, icon: Icon, tone = 'primary' }) {
  const toneClasses = {
    primary: 'bg-primary-light text-primary',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-surface border border-border rounded-card p-4 shadow-card">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </p>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-text-primary tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-text-secondary font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;