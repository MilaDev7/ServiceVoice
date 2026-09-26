import api from './api';

export const voiceService = {
  /**
   * Convert audio blob to text (Voxide STT).
   * @param {Blob} audioBlob
   * @param {{ language?: string }} options
   */
  transcribe: (audioBlob, { language = 'am' } = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);

    return api.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Convert text to audio URL (Voxide TTS).
   * @param {{ text: string, language?: string }} payload
   */
  synthesize: (payload) => api.post('/voice/synthesize', payload),

  /**
   * Submit voice feedback (anonymous).
   * @param {Blob} audioBlob
   * @param {{ serviceId?: string, woredaId?: string, language?: string }} metadata
   */
  submitFeedback: (audioBlob, metadata = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'feedback.webm');
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return api.post('/voice/feedback', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};