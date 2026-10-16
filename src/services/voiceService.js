import api from './api';

export const voiceService = {
  /**
   * Send audio and get back transcription + answer + reply audio.
   * Backend: POST /api/voice/chat
   * FormData: { audio (file), language, conversationId? }
   * Response (unwrapped): {
   *   conversationId, persistent,
   *   transcription: { text, confidence },
   *   answer,
   *   audio: { id, audioUrl, contentType, usage? },
   *   service
   * }
   */
  voiceChat: async (audioBlob, { language = 'am', conversationId } = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);
    if (conversationId) formData.append('conversationId', conversationId);

    // No Content-Type — axios sets multipart boundary
    const res = await api.post('/voice/chat', formData);
    return res;
  },
};