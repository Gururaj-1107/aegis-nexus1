const { TranslationServiceClient } = require('@google-cloud/translate').v3;

/**
 * Automatically detects language and translates to English if it's not English.
 * Ensures the Agentic workflow operates smoothly regardless of volunteer language.
 */
async function translateToEnglishIfNeeded(text) {
  // If no GOOGLE_CLOUD_PROJECT is configured, bypass the API strictly for demo fail-safes
  if (!process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT === 'your-gcp-project-id') {
    return text;
  }

  try {
    const translationClient = new TranslationServiceClient();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const location = 'global';

    // 1. Detect Language
    const [detectResponse] = await translationClient.detectLanguage({
      parent: `projects/${projectId}/locations/${location}`,
      content: text,
    });

    const detectedLanguageCode = detectResponse.languages[0].languageCode;

    // 2. If already English, skip
    if (detectedLanguageCode === 'en') {
      return text;
    }

    // 3. Otherwise, translate
    console.log(`[Translation] Detected foreign language: ${detectedLanguageCode}. Translating...`);
    
    const [translateResponse] = await translationClient.translateText({
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: detectedLanguageCode,
      targetLanguageCode: 'en',
    });

    const translatedText = translateResponse.translations[0].translatedText;
    console.log(`[Translation] Input translated automatically down to English pipeline.`);
    
    return translatedText;
  } catch (error) {
    console.error(`[Translation] Error in auto-translation pipeline:`, error.message);
    return text; // fallback to original input
  }
}

module.exports = { translateToEnglishIfNeeded };
