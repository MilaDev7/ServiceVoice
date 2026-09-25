export const ROUTES = {
  CHAT: '/',
  CHAT_SESSION: '/chat/:sessionId',
  SERVICES: '/services',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

export const buildChatSessionPath = (sessionId) => `/chat/${sessionId}`;