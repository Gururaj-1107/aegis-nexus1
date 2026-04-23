const express = require('express');
const router = express.Router();

// GET all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await req.prisma.announcement.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, priority, expires_at } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content required' });
    const announcement = await req.prisma.announcement.create({
      data: { title, content, priority: priority || 'NORMAL', expires_at: expires_at ? new Date(expires_at) : null, admin_id: req.user?.email || null }
    });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE announcement by id
router.delete('/:id', async (req, res) => {
  try {
    await req.prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
