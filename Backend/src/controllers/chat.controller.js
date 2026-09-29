export function createChatController(chatService) {
  return {
    answer: async (req, res) => {
      const result = await chatService.answer(req.body);
      res.json({ success: true, data: result });
    },
  };
}
