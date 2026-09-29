export function createVoiceController(voiceService) {
  return {
    process: async (req, res) => {
      const { audioBase64, mimeType, transcript } = req.body;
      const audio = {
        buffer: Buffer.from(audioBase64, "base64"),
        mimeType,
        transcript,
      };

      const result = await voiceService.process({
        audio,
        language: req.body.language,
        outputVoice: req.body.outputVoice,
      });

      res.json({ success: true, data: result });
    },
  };
}
