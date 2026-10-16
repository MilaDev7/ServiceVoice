import api from './api';

export const chatService = {
  /**
   * Send a text message and get a bot reply.
   * Backend returns { success, data: { conversationId, persistent, answer, service } }
   * axios interceptor unwraps to just: { conversationId, persistent, answer, service }
   */
  sendMessage: async ({ message, conversationId, language = 'am' }) => {
    const res = await api.post('/chat', {
      message,
      language,
      conversationId: conversationId || undefined,
    });
    return res; // already unwrapped
  },

  /**
   * List conversations for signed-in user.
   * Backend returns { success, data: { conversations } }
   * Unwrapped to: { conversations }
   */
  listConversations: async () => {
    const res = await api.get('/history');
    return res; // already unwrapped
  },

  /**
   * No single-conversation endpoint in backend.
   * Fetch list and filter.
   */
  getConversation: async (id) => {
    const { conversations } = await chatService.listConversations();
    return conversations.find((c) => c.id === id) || null;
  },

  /**
   * Not supported by backend — no-op.
   */
  saveConversation: async () => null,

  deleteConversation: async () => null,

  deleteAllConversations: async () => null,
};