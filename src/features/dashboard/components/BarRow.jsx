const COLOR_MAP = {
  primary: 'bg-primary',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
};

function BarRow({ label, value, max, suffix = '', color = 'primary', showValue = true }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-text-primary truncate">{label}</span>
        {showValue && (
          <span className="text-sm font-medium text-text-secondary tabular-nums ml-3">
            {value}
            {suffix}
          </span>
        )}
      </div>
      <div className="h-2 bg-page-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${COLOR_MAP[color] || COLOR_MAP.primary}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default BarRow;