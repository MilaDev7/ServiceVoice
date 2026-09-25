import { Link2, Mic, ChevronRight } from 'lucide-react';
import DependencyTile from './DependencyTile';

function DependencyCard({ dependencies, ctaText, onCtaClick, onVoiceClick }) {
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <div className="mt-3 bg-surface border border-border rounded-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <Link2 size={14} className="text-primary" />
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
          You need these first
        </h3>
      </div>

      {/* Grid of dependencies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 pb-3">
        {dependencies.map((dep) => (
          <DependencyTile
            key={dep.id}
            icon={dep.icon}
            name={dep.name}
            status={dep.status}
            onClick={() => console.log('Dependency clicked:', dep.name)}
          />
        ))}
      </div>

      {/* Voice prompt */}
      <div className="px-4 pb-3">
        <button
          onClick={onVoiceClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-btn bg-primary-light text-primary text-xs font-medium hover:bg-primary-border transition-colors"
        >
          <Mic size={14} />
          <span>Say which ones you have</span>
        </button>
      </div>

      {/* CTA */}
      {ctaText && (
        <button
          onClick={onCtaClick}
          className="w-full flex items-center justify-between px-4 py-3 border-t border-border text-sm font-medium text-primary hover:bg-primary-light transition-colors"
        >
          <span>{ctaText}</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

export default DependencyCard;