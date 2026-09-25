import { ChevronRight, Smartphone } from 'lucide-react';
import DocumentItem from './DocumentItem';

function DocumentCard({ documents, ctaText, onCtaClick, onSmsClick }) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="mt-3 bg-surface border border-border rounded-card overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
          Required Documents
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-2 pb-2">
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            icon={doc.icon}
            title={doc.title}
            description={doc.description}
          />
        ))}
      </div>

      {onSmsClick && (
        <button
          onClick={onSmsClick}
          className="w-full flex items-center justify-between px-4 py-3 border-t border-border text-sm font-medium text-primary hover:bg-primary-light transition-colors"
        >
          <span className="flex items-center gap-2">
            <Smartphone size={16} />
            Send checklist via SMS
          </span>
          <ChevronRight size={16} />
        </button>
      )}

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

export default DocumentCard;