import api from './api';

export const chatService = {
  /**
   * Send a message to the bot.
   * @param {{ content: string, sessionId?: string, language?: string, woredaId?: string }} payload
   * @returns {Promise<{ reply: object, sessionId: string }>}
   */
  sendMessage: (payload) => api.post('/chat/message', payload),

  /**
   * Get chat history for a session.
   * @param {string} sessionId
   */
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),

  /**
   * Create a new chat session.
   */
  createSession: () => api.post('/chat/session'),
};