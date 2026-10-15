import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../../../services/chatService';
import { useAuth } from '../../auth/components/AuthProvider';

const STORAGE_KEY = 'sv_chat_sessions';
const MAX_SESSIONS = 20;
const MAX_AGE_DAYS = 30;

function loadLocalSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw);
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    return sessions.filter((s) => new Date(s.updatedAt).getTime() > cutoff);
  } catch {
    return [];
  }
}

function persistLocalSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to persist local sessions:', err);
  }
}

// Backend conversation → frontend session shape
function normalizeConversation(c) {
  return {
    id: c.id,
    title: c.title || 'Conversation',
    messages: (c.messages || []).map((m) => ({
      id: m.id,
      role: m.role === 'assistant' ? 'bot' : m.role,
      content: m.content,
      timestamp: m.createdAt,
    })),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export function useChatHistory() {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        try {
          const { conversations } = await chatService.listConversations();
          if (!cancelled) setSessions(conversations.map(normalizeConversation));
        } catch (err) {
          console.warn('Failed to load server history:', err);
          if (!cancelled) setSessions([]);
        }
      } else {
        if (!cancelled) setSessions(loadLocalSessions());
      }
      if (!cancelled) setIsLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Persist (guest only)
  useEffect(() => {
    if (!isAuthenticated) {
      persistLocalSessions(sessions);
    }
  }, [sessions, isAuthenticated]);

  const saveSession = useCallback((session) => {
    // In guest mode: persist to localStorage
    // In authed mode: backend auto-persists via /chat — no action needed
    if (isAuthenticated) return;

    const trimmed = {
      id: session.id,
      title: session.title || 'New chat',
      messages: session.messages.slice(-30),
      createdAt: session.createdAt,
      updatedAt: new Date().toISOString(),
    };

    setSessions((prev) => {
      const existing = prev.findIndex((s) => s.id === trimmed.id);
      let next;
      if (existing >= 0) {
        next = [...prev];
        next[existing] = trimmed;
      } else {
        next = [trimmed, ...prev];
      }
      return next
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, MAX_SESSIONS);
    });
  }, [isAuthenticated]);

  const getSession = useCallback(
    (id) => sessions.find((s) => s.id === id),
    [sessions]
  );

  const deleteSession = useCallback((id) => {
    // Local-only for now
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSessions([]);
  }, []);

  // Refresh from server (call after sending a message when authed)
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { conversations } = await chatService.listConversations();
      setSessions(conversations.map(normalizeConversation));
    } catch (err) {
      console.warn('Refresh failed:', err);
    }
  }, [isAuthenticated]);

  return {
    sessions,
    isLoading,
    saveSession,
    getSession,
    deleteSession,
    clearAll,
    refresh, 
  };
}