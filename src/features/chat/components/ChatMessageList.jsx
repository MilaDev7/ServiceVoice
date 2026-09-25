import { useEffect, useRef } from 'react';
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';
import QuickActions from './QuickActions';

function ChatMessageList({ messages, onActionClick, onSmsClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <BotMessage message={message} onSmsClick={onSmsClick} />
            )}

            {message.type === 'quickActions' && message.actions && (
              <QuickActions
                actions={message.actions}
                onActionClick={onActionClick}
              />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatMessageList;