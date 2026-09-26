import api from './api';

export const feedbackService = {
  /**
   * Submit text feedback (anonymous).
   * @param {{ serviceId?: string, woredaId?: string, text: string, type?: string }} payload
   */
  submit: (payload) => api.post('/feedback', payload),

  /**
   * Get public dashboard aggregate stats.
   * @param {{ serviceId?: string, woredaId?: string }} filters
   */
  getDashboard: (filters = {}) =>
    api.get('/feedback/dashboard', { params: filters }),

  /**
   * Get aggregated feedback for a specific service.
   * @param {string} serviceId
   */
  getByService: (serviceId) => api.get(`/feedback/service/${serviceId}`),
};