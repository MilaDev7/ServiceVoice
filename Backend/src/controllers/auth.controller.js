export function createAuthController(authService) {
  return {
    register: async (req, res) => {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    },

    login: async (req, res) => {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    },

    refresh: async (req, res) => {
      const result = await authService.refresh(req.body.refreshToken);
      res.json({ success: true, data: result });
    },

    me: (req, res) => {
      res.json({ success: true, data: req.user });
    },
  };
}
