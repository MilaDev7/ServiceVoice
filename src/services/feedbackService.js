import api from './api';

export const feedbackService = {
  submit: async ({ content, feedbackType = 'other', language = 'am', serviceId, woredaId }) => {
    return api.post('/feedback', {
      content,
      feedbackType,
      language,
      serviceId,
      woredaId,
    });
  },

  getDashboard: async () => {
    return api.get('/feedback/dashboard');
  },
};