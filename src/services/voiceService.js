import api from './api';

export const voiceService = {
  /**
   * Send audio and get back transcription + answer + reply audio.
   * Backend: POST /api/voice
   * FormData: { audio (file), language, conversationId? }
   * Response: {
   *   success,
   *   data: {
   *     conversationId,
   *     persistent,
   *     transcription: { text, confidence },
   *     answer,
   *     audio: { id, audioUrl, contentType, usage? },
   *     service
   *   }
   * }
   */
  voiceChat: async (audioBlob, { language = 'am', conversationId } = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);
    if (conversationId) formData.append('conversationId', conversationId);

    // IMPORTANT: no Content-Type header — axios sets multipart boundary
    const res = await api.post('/voice', formData);
    return res.data; // { conversationId, persistent, transcription, answer, audio, service }
  },
};