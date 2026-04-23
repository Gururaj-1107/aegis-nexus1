const express = require('express');
const router = express.Router();
const multer = require('multer');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const { processRequestWithAgent } = require('../services/agent');

const upload = multer();
const docAIClient = new DocumentProcessorServiceClient();

router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
       return res.status(400).json({ error: "No document image uploaded" });
    }

    const documentBytes = req.file.buffer.toString('base64');
    
    const name = `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/us/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;
    const request = {
      name,
      rawDocument: {
        content: documentBytes,
        mimeType: req.file.mimetype,
      },
    };

    const [result] = await docAIClient.processDocument(request);
    const text = result.document.text;
    console.log(`Parsed handwritten document text length: ${text.length}`);

    // Send the extracted raw text to the Vertex AI agent to structure
    const agentIntent = await processRequestWithAgent(`Document Report Text:\n${text}`);

    res.json({
        status: "success",
        extractedData: agentIntent,
        intent: agentIntent
    });
  } catch (error) {
    console.error("Document routing error:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

module.exports = router;
