import { useState, useRef } from 'react';
import { Paperclip, Mic, ArrowUp } from 'lucide-react';

function ChatInput({ onSend, onMicClick, onAttachClick, disabled = false }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter makes new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-page-bg border border-border rounded-2xl px-3 py-2 focus-within:border-primary-border focus-within:ring-1 focus-within:ring-primary-border transition-all">
          {/* Attachment */}
          <button
            type="button"
            onClick={onAttachClick}
            className="flex-shrink-0 p-1.5 text-text-secondary hover:text-primary transition-colors"
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask in Amharic or English..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none max-h-32 py-1.5"
            style={{ minHeight: '28px' }}
          />

          {/* Mic button */}
          <button
            type="button"
            onClick={onMicClick}
            disabled={disabled}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary hover:bg-primary-border transition-colors disabled:opacity-50"
            aria-label="Voice input"
          >
            <Mic size={16} />
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;