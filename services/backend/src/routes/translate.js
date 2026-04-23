const express = require('express');
const router = express.Router();
const { TranslationServiceClient } = require('@google-cloud/translate').v3;

// POST /api/translate
router.post('/', async (req, res) => {
  try {
    const { text, target_language } = req.body;
    if (!text || !target_language) return res.status(400).json({ error: 'text and target_language required' });

    if (!process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT === 'your-gcp-project-id') {
      return res.json({ translated: text, note: 'Translation API not configured' });
    }

    const client = new TranslationServiceClient();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const [response] = await client.translateText({
      parent: `projects/${projectId}/locations/global`,
      contents: [text], mimeType: 'text/plain', targetLanguageCode: target_language,
    });
    res.json({ translated: response.translations[0].translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message, translated: req.body.text });
  }
});

module.exports = router;
