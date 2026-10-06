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

  // ─────────────────────────────────────────────
  // Use refs for session load — avoids effect loops
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
  // Load session ONLY when URL changes
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
  // Save session ONLY when messages change
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;

    // Determine session ID (create one on first message)
    const id = urlSessionId || sessionId || `chat-${Date.now()}`;

    if (!sessionId && !urlSessionId) {
      // First message in a fresh chat — assign ID + update URL
      setSessionId(id);
      navigate(`/chat/${id}`, { replace: true });
    }

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
  // Bot reply generator (placeholder until P3 ready)
  // ─────────────────────────────────────────────
  const generateBotReply = useCallback((text) => {
    const lower = text.toLowerCase();

    // Simple keyword matching for demo purposes
    if (lower.includes('birth') || lower.includes('ልደት')) {
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content:
          'To get a birth certificate in Ethiopia, you will generally need: a valid ID, the application form from the office, and payment of the required fee. Would you like to know where to apply?',
        timestamp: new Date().toISOString(),
        type: 'documents',
        documents: [
          { id: 'doc-1', icon: 'IdCard', title: "Parent or applicant's valid ID", description: 'National ID, Passport or other official ID' },
          { id: 'doc-2', icon: 'FileText', title: 'Application form (from the office)', description: 'Form is provided at the service office' },
          { id: 'doc-3', icon: 'Calendar', title: 'Birth information (date & place)', description: 'Full date and place of birth of the person' },
          { id: 'doc-4', icon: 'CreditCard', title: 'Payment of required fee', description: 'Pay the official fee at the office or bank' },
          { id: 'doc-5', icon: 'Users', title: 'Parent/Guardian information', description: 'Names of father and mother/guardian' },
        ],
        ctaText: 'See full process, fees & office locations',
      };
    }

    if (lower.includes('marriage') || lower.includes('ጋብቻ')) {
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: 'Before you can apply for a marriage certificate, you need to have these:',
        timestamp: new Date().toISOString(),
        type: 'dependencies',
        dependencies: [
          { id: 'dep-1', icon: 'IdCard', name: 'Kebele ID', status: 'have' },
          { id: 'dep-2', icon: 'FileText', name: 'Birth Certificate', status: 'need' },
          { id: 'dep-3', icon: 'FileCheck', name: 'Unmarried Certificate', status: 'unsure' },
        ],
        ctaText: 'Guide me through missing ones',
      };
    }

    if (lower.includes('kebele') || lower.includes('ቀበሌ')) {
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: 'For a Kebele ID, you need to visit your local kebele office with proof of residence and 2 photos. Want step-by-step guidance?',
        timestamp: new Date().toISOString(),
        type: 'quickActions',
        actions: [
          { id: 'act-1', label: 'Where to apply', action: 'where' },
          { id: 'act-2', label: 'Next steps', action: 'steps' },
          { id: 'act-3', label: 'Fees', action: 'fees' },
        ],
      };
    }

    // Default reply
    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      content: `I understand you're asking about: "${text}". Which service do you need help with? (Kebele ID, Birth Certificate, Marriage Certificate, etc.)`,
      timestamp: new Date().toISOString(),
    };
  }, []);

  // ─────────────────────────────────────────────
  // Send message — with graceful fallback
  // ─────────────────────────────────────────────
  const sendUserMessage = useCallback(
    (text) => {
      const newMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsThinking(true);

      // Simulate bot thinking + reply (real backend wiring comes later)
      setTimeout(() => {
        setMessages((prev) => [...prev, generateBotReply(text)]);
        setIsThinking(false);
      }, 800);
    },
    [generateBotReply]
  );

  // ─────────────────────────────────────────────
  // Handle ?q= query param (from ServicesPage)
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