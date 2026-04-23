const express = require('express');
const router = express.Router();

// GET /api/knowledge — list all KB entries
router.get('/', async (req, res) => {
  try {
    const entries = await req.prisma.$queryRawUnsafe(`SELECT id, title, content, metadata FROM "KnowledgeBase" ORDER BY title`);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/knowledge/ingest — ingest new knowledge with embedding (B4)
router.post('/ingest', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content required' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    let embedding = Array(768).fill(0.01);
    if (GEMINI_KEY && GEMINI_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
      const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
      const embUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`;
      const embRes = await fetch(embUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'models/text-embedding-004', content: { parts: [{ text: content }] } }) });
      const embData = await embRes.json();
      if (embData.embedding?.values) embedding = embData.embedding.values;
    }

    const vecStr = `[${embedding.join(',')}]`;
    await req.prisma.$executeRawUnsafe(
      `INSERT INTO "KnowledgeBase" (id, title, content, embedding) VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
      title, content, vecStr
    );
    res.json({ success: true, title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/knowledge/:id
router.delete('/:id', async (req, res) => {
  try {
    await req.prisma.$executeRawUnsafe(`DELETE FROM "KnowledgeBase" WHERE id = $1`, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
