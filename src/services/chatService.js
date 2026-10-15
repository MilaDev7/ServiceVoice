import api from './api';

export const chatService = {
  /**
   * Send a text message and get a bot reply.
   * Backend: POST /api/chat
   * Body: { message, language, conversationId? }
   * Response: { success, data: { conversationId, persistent, answer, service } }
   */
  sendMessage: async ({ message, conversationId, language = 'am' }) => {
    const res = await api.post('/chat', {
      message,
      language,
      conversationId: conversationId || undefined,
    });
    return res.data; // { conversationId, persistent, answer, service }
  },

  /**
   * List conversations for signed-in user.
   * Backend: GET /api/history
   * Response: { success, data: { conversations } }
   */
  listConversations: async () => {
    const res = await api.get('/history');
    return res.data; // { conversations }
  },

  /**
   * No specific single-conversation endpoint in backend.
   * We fetch the whole list and filter. Alternatively, could add later.
   */
  getConversation: async (id) => {
    const { conversations } = await chatService.listConversations();
    return conversations.find((c) => c.id === id) || null;
  },

  /**
   * ⚠️ Backend does NOT expose POST /history/conversations.
   * Conversations are created automatically via /chat when authenticated.
   * So this becomes a no-op for now (or remove entirely).
   */
  saveConversation: async () => {
    console.warn('[chatService] saveConversation is a no-op — backend auto-creates on /chat');
    return null;
  },

  /**
   * ⚠️ Backend does NOT expose DELETE /history/:id.
   * Removing this from frontend for now.
   */
  deleteConversation: async () => {
    console.warn('[chatService] deleteConversation not supported by backend');
    return null;
  },

  deleteAllConversations: async () => {
    console.warn('[chatService] deleteAllConversations not supported by backend');
    return null;
  },
};