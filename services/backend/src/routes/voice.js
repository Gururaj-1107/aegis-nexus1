const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processRequestWithAgent } = require('../services/agent');
const { dispatchMatcher } = require('../services/matcherClient');
const speech = require('@google-cloud/speech');

const upload = multer();
const speechClient = new speech.SpeechClient();

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioBytes = req.file.buffer.toString('base64');
    
    const audio = { content: audioBytes };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };

    const request = { audio, config };
    const [response] = await speechClient.recognize(request);
    
    if (response.results.length === 0) {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    const transcript = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcribed voice: ${transcript}`);

    // Vertex AI call to parse JSON out of transcript
    const agentIntent = await processRequestWithAgent(transcript);
    
    // Find optimal match using C++ matcher via JSON payload
    const match = await dispatchMatcher(agentIntent);

    res.json({
        status: "success",
        transcript,
        intent: agentIntent,
        dispatched_volunteer: match || "No available medics nearby"
    });
  } catch (error) {
    console.error("Voice routing error:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

module.exports = router;
