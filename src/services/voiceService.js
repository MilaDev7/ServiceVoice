import api from './api';

export const voiceService = {
  /**
   * Send an audio recording and get back:
   * - transcript (what user said)
   * - replyText (bot response text)
   * - replyAudioUrl (bot response audio)
   *
   * @param {Blob} audioBlob
   * @param {{ language?: string, conversationId?: string, woredaId?: string }} metadata
   */
  voiceChat: (audioBlob, metadata = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Do NOT set Content-Type — axios sets multipart boundary automatically
    return api.post('/voice/chat', formData);
  },

  /**
   * Submit anonymous voice feedback (no auth).
   * If not in P3's contract, this may be future — keep for now.
   */
  submitFeedback: (audioBlob, metadata = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'feedback.webm');

    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return api.post('/voice/feedback', formData);
  },
};