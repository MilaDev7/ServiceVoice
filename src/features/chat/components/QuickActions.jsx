function QuickActions({ actions, onActionClick }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-11">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick?.(action)}
          className="px-4 py-2 rounded-pill border border-border bg-surface text-sm font-medium text-primary hover:bg-primary-light hover:border-primary-border transition-colors"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;