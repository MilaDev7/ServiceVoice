import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'sv_chat_sessions';
const MAX_SESSIONS = 20;
const MAX_AGE_DAYS = 30;

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const sessions = JSON.parse(raw);
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // Filter out old sessions
    return sessions.filter((s) => new Date(s.updatedAt).getTime() > cutoff);
  } catch (err) {
    console.warn('Failed to load chat sessions:', err);
    return [];
  }
}

function persistSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to persist chat sessions:', err);
  }
}

export function useChatHistory() {
  const [sessions, setSessions] = useState([]);

  // Initial load
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // Save whenever sessions change
  useEffect(() => {
    persistSessions(sessions);
  }, [sessions]);

  const saveSession = useCallback((session) => {
    setSessions((prev) => {
      const existing = prev.findIndex((s) => s.id === session.id);

      const trimmed = {
        id: session.id,
        title: session.title || 'New chat',
        messages: session.messages.slice(-30), // Cap stored messages
        createdAt: session.createdAt,
        updatedAt: new Date().toISOString(),
      };

      let next;
      if (existing >= 0) {
        next = [...prev];
        next[existing] = trimmed;
      } else {
        next = [trimmed, ...prev];
      }

      // Sort by updatedAt desc, cap at MAX
      return next
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, MAX_SESSIONS);
    });
  }, []);

  const getSession = useCallback(
    (id) => {
      return sessions.find((s) => s.id === id);
    },
    [sessions]
  );

  const deleteSession = useCallback((id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSessions([]);
  }, []);

  return {
    sessions,
    saveSession,
    getSession,
    deleteSession,
    clearAll,
  };
}