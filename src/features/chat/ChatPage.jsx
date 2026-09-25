import { useState } from 'react';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import FeedbackPrompt from './components/FeedbackPrompt';
import { mockMessages } from './data/mockMessages';

function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleActionClick = (action) => {
    console.log('Quick action clicked:', action.label, '— action key:', action.action);

    
    setIsFeedbackOpen(true);
  };

  const handleSmsClick = () => {
    console.log('SMS checklist requested for current service');
    
  };

  const handleSend = (text) => {
    const newMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    setIsThinking(true);
    setTimeout(() => {
      const botReply = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content:
          "I understand. Let me look that up. (This is a placeholder response — real answers coming soon.)",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsThinking(false);
    }, 800);
  };

  const handleMicClick = () => {
    console.log('Mic clicked — Voxide integration comes later');
  };

  const handleAttachClick = () => {
    console.log('Attach clicked');
  };

  const handleFeedbackSubmit = (payload) => {
    console.log('Feedback submitted:', payload);
   
  };

  return (
    <div className="h-full flex flex-col">
      <ChatMessageList
        messages={messages}
        onActionClick={handleActionClick}
        onSmsClick={handleSmsClick}
      />

      {isThinking && (
        <div className="px-4 pb-2 max-w-3xl mx-auto w-full">
          <p className="text-xs text-text-secondary ml-11">Thinking...</p>
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        onMicClick={handleMicClick}
        onAttachClick={handleAttachClick}
        disabled={isThinking}
      />

      <FeedbackPrompt
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        serviceName="Birth Certificate"
      />
    </div>
  );
}

export default ChatPage;