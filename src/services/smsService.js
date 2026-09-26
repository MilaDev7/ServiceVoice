import api from './api';

export const smsService = {
  /**
   * Send a document checklist via SMS to a phone.
   * @param {{ phone: string, serviceId: string, woredaId?: string, language?: string }} payload
   */
  sendChecklist: (payload) => api.post('/sms/checklist', payload),
};