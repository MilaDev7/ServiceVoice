import api from './api';

export const chatService = {
  /**
   * Send a text message and get a bot reply.
   * @param {{ message: string, conversationId?: string, language?: string, woredaId?: string }} payload
   */
  sendMessage: (payload) => api.post('/chat', payload),

  /**
   * List all conversations (signed-in users only).
   */
  listConversations: () => api.get('/chat/conversations'),

  /**
   * Get a single conversation with messages.
   */
  getConversation: (id) => api.get(`/chat/conversations/${id}`),

  /**
   * Create or update a conversation (upsert).
   * @param {{ id?: string, title: string, messages: Array }} payload
   */
  saveConversation: (payload) => api.post('/chat/conversations', payload),

  /**
   * Delete a single conversation.
   */
  deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),

  /**
   * Delete ALL conversations for the signed-in user.
   */
  deleteAllConversations: () => api.delete('/chat/conversations'),
};