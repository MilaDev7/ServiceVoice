import { Shield } from 'lucide-react';
import DocumentCard from './DocumentCard';
import DependencyCard from './DependencyCard';

function BotMessage({ message, onSmsClick }) {
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCtaClick = () => {
    console.log('CTA clicked for message', message.id);
  };

  const handleVoiceClick = () => {
    console.log('Voice clicked for message', message.id);
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
        <Shield size={16} className="text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-bot-bubble border border-border rounded-card shadow-message px-4 py-3">
          <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {message.type === 'documents' && message.documents && (
            <DocumentCard
              documents={message.documents}
              ctaText={message.ctaText}
              onCtaClick={handleCtaClick}
              onSmsClick={onSmsClick}
            />
          )}

          {message.type === 'dependencies' && message.dependencies && (
            <DependencyCard
              dependencies={message.dependencies}
              ctaText={message.ctaText}
              onCtaClick={handleCtaClick}
              onVoiceClick={handleVoiceClick}
            />
          )}
        </div>

        <div className="mt-1 text-[11px] text-text-secondary">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default BotMessage;