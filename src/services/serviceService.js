import api from './api';

export const serviceService = {
  
  listAll: () => api.get('/services'),

  /**
   * Get a service with playbook for a specific woreda.
   * @param {string} slug — e.g. 'kebele-id'
   * @param {{ woredaId?: string, language?: string }} params
   */
  getDetail: (slug, params = {}) =>
    api.get(`/services/${slug}`, { params }),

  /**
   * Get dependencies for a service (what you need first).
   * @param {string} slug
   */
  getDependencies: (slug) => api.get(`/services/${slug}/dependencies`),

  
  listWoredas: () => api.get('/woredas'),
};