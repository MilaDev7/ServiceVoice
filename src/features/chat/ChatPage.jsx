import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import FeedbackPrompt from './components/FeedbackPrompt';
import VoiceFab from './components/VoiceFab';
import VoiceOverlay from './components/VoiceOverlay';
import { mockMessages } from './data/mockMessages';

function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState(mockMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const hasHandledQuery = useRef(false);

  // Shared bot reply generator
  const generateBotReply = (text) => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    content: `I understand you're asking about: "${text}". (Placeholder response — real answers coming soon.)`,
    timestamp: new Date().toISOString(),
  });

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
      setMessages((prev) => [...prev, generateBotReply(text)]);
      setIsThinking(false);
    }, 800);
  };

  // Handle ?q= query param from ServicesPage
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !hasHandledQuery.current) {
      hasHandledQuery.current = true;

      // Reset messages, then send the new prompt
      setMessages([]);
      setTimeout(() => sendUserMessage(query), 100);

      // Clean the URL (remove ?q=) so refresh doesn't re-send
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleActionClick = (action) => {
    console.log('Quick action clicked:', action.label);
    setIsFeedbackOpen(true);
  };

  const handleSmsClick = () => console.log('SMS checklist requested');
  const handleSend = (text) => sendUserMessage(text);
  const handleVoiceTranscript = (transcript) => sendUserMessage(transcript);
  const handleMicClick = () => setIsVoiceOpen(true);
  const handleAttachClick = () => console.log('Attach clicked');
  const handleFeedbackSubmit = (payload) =>
    console.log('Feedback submitted:', payload);

  return (
    <div className="h-full min-h-0 flex flex-col relative">
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

      <VoiceFab onClick={() => setIsVoiceOpen(true)} disabled={isThinking} />

      <VoiceOverlay
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscript={handleVoiceTranscript}
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