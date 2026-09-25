import { useState } from 'react';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import FeedbackPrompt from './components/FeedbackPrompt';
import VoiceFab from './components/VoiceFab';
import VoiceOverlay from './components/VoiceOverlay';
import { mockMessages } from './data/mockMessages';

function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const handleActionClick = (action) => {
    console.log('Quick action clicked:', action.label);
    setIsFeedbackOpen(true);
  };

  const handleSmsClick = () => {
    console.log('SMS checklist requested');
  };

  const sendUserMessage = (text) => {
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
          "I understand. Let me look that up. (Placeholder response.)",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsThinking(false);
    }, 800);
  };

  const handleSend = (text) => sendUserMessage(text);

  const handleVoiceTranscript = (transcript) => {
    sendUserMessage(transcript);
  };

  const handleMicClick = () => setIsVoiceOpen(true);
  const handleAttachClick = () => console.log('Attach clicked');

  const handleFeedbackSubmit = (payload) => {
    console.log('Feedback submitted:', payload);
  };

  return (
    <div className="h-full flex flex-col relative">
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

      {/* Floating voice button */}
      <VoiceFab onClick={() => setIsVoiceOpen(true)} disabled={isThinking} />

      {/* Full-screen voice overlay */}
      <VoiceOverlay
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscript={handleVoiceTranscript}
      />

      {/* Feedback modal */}
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