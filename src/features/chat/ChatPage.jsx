import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import FeedbackPrompt from './components/FeedbackPrompt';
import VoiceFab from './components/VoiceFab';
import VoiceOverlay from './components/VoiceOverlay';
import { useChatHistory } from '../history/hooks/useChatHistory';
import { usePreferences } from '../settings/hooks/usePreferences';
import { useTranslation } from '../../i18n';
import { chatService } from '../../services/chatService';

function ChatPage() {
  const { sessionId: urlSessionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveSession, getSession, refresh: refreshHistory } = useChatHistory();
  const { language } = usePreferences();
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(urlSessionId || null);
  const [isThinking, setIsThinking] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const hasHandledQuery = useRef(false);

  // ─────────────────────────────────────────────
  // Refs to avoid effect loops
  // ─────────────────────────────────────────────
  const getSessionRef = useRef(getSession);
  useEffect(() => {
    getSessionRef.current = getSession;
  }, [getSession]);

  const saveSessionRef = useRef(saveSession);
  useEffect(() => {
    saveSessionRef.current = saveSession;
  }, [saveSession]);

  // ─────────────────────────────────────────────
  // Load session when URL changes
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (urlSessionId) {
      const existing = getSessionRef.current(urlSessionId);
      if (existing) {
        setSessionId(existing.id);
        setMessages(existing.messages || []);
        return;
      }
    }
    setSessionId(urlSessionId || null);
    setMessages([]);
  }, [urlSessionId]);

  // ─────────────────────────────────────────────
  // Save to localStorage (guest mode only — authed users auto-saved by backend)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;

    const id = urlSessionId || sessionId || `chat-${Date.now()}`;
    if (!sessionId && !urlSessionId) setSessionId(id);

    const firstUser = messages.find((m) => m.role === 'user');
    const title = firstUser
      ? firstUser.content.slice(0, 40) +
        (firstUser.content.length > 40 ? '…' : '')
      : 'New chat';

    saveSessionRef.current({
      id,
      title,
      messages,
      createdAt: messages[0]?.timestamp || new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // ─────────────────────────────────────────────
  // Fallback bot reply (used if backend is unreachable)
  // ─────────────────────────────────────────────
  const generateFallbackReply = useCallback((text) => {
    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      content: `I couldn't reach the server. Please check your connection and try again. You asked: "${text}"`,
      timestamp: new Date().toISOString(),
    };
  }, []);

  // ─────────────────────────────────────────────
  // Send message — REAL backend integration
  // ─────────────────────────────────────────────
  const sendUserMessage = useCallback(
    async (text) => {
      const newMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsThinking(true);

      try {
        const res = await chatService.sendMessage({
          message: text,
          conversationId: sessionId || urlSessionId || undefined,
          language: language || 'am',
        });

        // Backend response (unwrapped by axios interceptor):
        // { conversationId, persistent, answer, service }

        const botMessage = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: res.answer,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);

        // If backend created/returned a conversation ID, update URL
        if (res.conversationId && res.conversationId !== sessionId) {
          setSessionId(res.conversationId);
          navigate(`/chat/${res.conversationId}`, { replace: true });
        }

        // Refresh sidebar for signed-in users
        if (res.persistent) {
          refreshHistory();
        }
      } catch (err) {
        console.error('[chat] send failed:', err);
        // Show error to user via fallback message
        setMessages((prev) => [...prev, generateFallbackReply(text)]);
      } finally {
        setIsThinking(false);
      }
    },
    [sessionId, urlSessionId, language, navigate, refreshHistory, generateFallbackReply]
  );

  // ─────────────────────────────────────────────
  // Handle ?q= from ServicesPage
  // ─────────────────────────────────────────────
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !hasHandledQuery.current) {
      hasHandledQuery.current = true;
      setSearchParams({}, { replace: true });
      setTimeout(() => sendUserMessage(query), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handlers
  const handleActionClick = (action) => {
    console.log('Quick action clicked:', action.label);
    setIsFeedbackOpen(true);
  };
  const handleSmsClick = () => console.log('SMS requested');
  const handleSend = (text) => sendUserMessage(text);
  const handleVoiceTranscript = (transcript) => {
    // Voice transcript came back — insert as user message
    // (In the future, VoiceOverlay will call the voice API directly
    // and pass back both transcript AND bot answer.)
    sendUserMessage(transcript);
  };
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