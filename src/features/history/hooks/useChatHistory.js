import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../../../services/chatService';
import { useAuth } from '../../auth/components/AuthProvider';

const STORAGE_KEY = 'sv_chat_sessions';
const MAX_SESSIONS = 20;
const MAX_AGE_DAYS = 30;

// ─────────────────────────────────────────────
// Local (guest) storage helpers
// ─────────────────────────────────────────────
function loadLocalSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const sessions = JSON.parse(raw);
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    return sessions.filter((s) => new Date(s.updatedAt).getTime() > cutoff);
  } catch (err) {
    console.warn('Failed to load local chat sessions:', err);
    return [];
  }
}

function persistLocalSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to persist local chat sessions:', err);
  }
}

// ─────────────────────────────────────────────
// Server (signed-in) helpers
// ─────────────────────────────────────────────
async function loadServerConversations() {
  try {
    const res = await chatService.listConversations();
    const list = res?.conversations ?? res ?? [];
    return list.map((c) => ({
      id: c.id,
      title: c.title || 'New chat',
      messages: c.messages || [],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  } catch (err) {
    console.warn('Failed to load server conversations:', err);
    return [];
  }
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useChatHistory() {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load on mount or auth state change
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        const serverSessions = await loadServerConversations();
        if (!cancelled) setSessions(serverSessions);
      } else {
        if (!cancelled) setSessions(loadLocalSessions());
      }
      if (!cancelled) setIsLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Persist — only in guest mode
  useEffect(() => {
    if (!isAuthenticated) {
      persistLocalSessions(sessions);
    }
  }, [sessions, isAuthenticated]);

  const saveSession = useCallback(
    async (session) => {
      const trimmed = {
        id: session.id,
        title: session.title || 'New chat',
        messages: session.messages.slice(-30),
        createdAt: session.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
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

      // Persist to server if signed in
      if (isAuthenticated) {
        try {
          await chatService.saveConversation(trimmed);
        } catch (err) {
          console.warn('Failed to save conversation to server:', err);
        }
      }
    },
    [isAuthenticated]
  );

  const getSession = useCallback(
    (id) => sessions.find((s) => s.id === id),
    [sessions]
  );

  const deleteSession = useCallback(
    async (id) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));

      if (isAuthenticated) {
        try {
          await chatService.deleteConversation(id);
        } catch (err) {
          console.warn('Failed to delete conversation on server:', err);
        }
      }
    },
    [isAuthenticated]
  );

  const clearAll = useCallback(async () => {
    setSessions([]);

    if (isAuthenticated) {
      try {
        await chatService.deleteAllConversations();
      } catch (err) {
        console.warn('Failed to clear conversations on server:', err);
      }
    }
  }, [isAuthenticated]);

  return {
    sessions,
    isLoading,
    saveSession,
    getSession,
    deleteSession,
    clearAll,
  };
}