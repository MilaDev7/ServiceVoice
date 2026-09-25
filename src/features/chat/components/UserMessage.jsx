import { Check } from 'lucide-react';

function UserMessage({ message }) {
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] sm:max-w-[70%] bg-user-bubble text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-message">
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-white/70">
          <span>{formatTime(message.timestamp)}</span>
          <Check size={12} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

export default UserMessage;