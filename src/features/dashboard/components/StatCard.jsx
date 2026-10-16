import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = 'primary',
  hint,
  onClick,
  clickable = false,
}) {
  const toneClasses = {
    primary: 'bg-primary-light text-primary',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  };

  const isInteractive = clickable || !!onClick;

  const content = (
    <>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-center gap-1">
          {Icon && (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}
            >
              <Icon size={16} />
            </div>
          )}
          {isInteractive && (
            <ChevronRight
              size={16}
              className="text-text-secondary group-hover:text-primary transition-colors"
            />
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-text-primary tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-text-secondary font-medium">
            {suffix}
          </span>
        )}
      </div>

      {hint && (
        <p className="text-[11px] text-primary font-medium mt-2 group-hover:underline transition-all">
          {hint}
        </p>
      )}
    </>
  );

  // Interactive version — renders as button
  if (isInteractive) {
    return (
      <button
        onClick={onClick}
        className={clsx(
          'group w-full text-left bg-surface border border-border rounded-card p-4 shadow-card',
          'hover:border-primary-border hover:shadow-md active:scale-[0.98]',
          'transition-all cursor-pointer'
        )}
      >
        {content}
      </button>
    );
  }

  // Static version — renders as div
  return (
    <div className="bg-surface border border-border rounded-card p-4 shadow-card">
      {content}
    </div>
  );
}

export default StatCard;