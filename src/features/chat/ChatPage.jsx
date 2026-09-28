import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import FeedbackPrompt from './components/FeedbackPrompt';
import VoiceFab from './components/VoiceFab';
import VoiceOverlay from './components/VoiceOverlay';
import { useChatHistory } from '../history/hooks/useChatHistory';
import { useTranslation } from '../../i18n';

function ChatPage() {
  const { sessionId: urlSessionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveSession, getSession } = useChatHistory();
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(urlSessionId || null);
  const [isThinking, setIsThinking] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const hasHandledQuery = useRef(false);

  useEffect(() => {
    if (urlSessionId) {
      const existing = getSession(urlSessionId);
      if (existing) {
        setSessionId(existing.id);
        setMessages(existing.messages || []);
        return;
      }
    }
    setSessionId(urlSessionId || null);
    setMessages([]);
  }, [urlSessionId, getSession]);

  useEffect(() => {
    if (messages.length === 0) return;

    const id = sessionId || `chat-${Date.now()}`;
    if (!sessionId) setSessionId(id);

    const firstUser = messages.find((m) => m.role === 'user');
    const title = firstUser
      ? firstUser.content.slice(0, 40) +
        (firstUser.content.length > 40 ? '…' : '')
      : 'New chat';

    saveSession({
      id,
      title,
      messages,
      createdAt: messages[0]?.timestamp || new Date().toISOString(),
    });
  }, [messages, sessionId, saveSession]);

  const generateBotReply = (text) => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    content: `I understand you're asking about: "${text}". (Placeholder — real answers coming soon.)`,
    timestamp: new Date().toISOString(),
  });

  const sendUserMessage = useCallback((text) => {
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
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !hasHandledQuery.current) {
      hasHandledQuery.current = true;

      const newId = `chat-${Date.now()}`;
      setSessionId(newId);
      setMessages([]);
      navigate(`/chat/${newId}`, { replace: true });

      setTimeout(() => sendUserMessage(query), 100);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, navigate, sendUserMessage]);

  const handleActionClick = (action) => {
    console.log('Quick action clicked:', action.label);
    setIsFeedbackOpen(true);
  };

  const handleSmsClick = () => console.log('SMS requested');
  const handleSend = (text) => sendUserMessage(text);
  const handleVoiceTranscript = (t) => sendUserMessage(t);
  const handleMicClick = () => setIsVoiceOpen(true);
  const handleAttachClick = () => console.log('Attach clicked');
  const handleFeedbackSubmit = (p) => console.log('Feedback:', p);

  return (
    <div className="h-full min-h-0 flex flex-col relative">
      <ChatMessageList
        messages={messages}
        onActionClick={handleActionClick}
        onSmsClick={handleSmsClick}
      />

      {isThinking && (
        <div className="px-4 pb-2 max-w-3xl mx-auto w-full">
          <p className="text-xs text-text-secondary ml-11">{t('chat.thinking')}</p>
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