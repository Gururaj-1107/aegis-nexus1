const express = require('express');
const router = express.Router();
const { queryGeminiChat } = require('../services/agent');

router.post('/chat', async (req, res) => {
  try {
    const { messages, systemContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const result = await queryGeminiChat(messages, systemContext, req.prisma);
    res.json({ status: 'success', ...result });
  } catch (error) {
    console.error('[Gemini Route] Error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
