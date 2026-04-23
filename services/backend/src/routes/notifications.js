const express = require('express');
const router = express.Router();

// GET /api/notifications — get all for user
router.get('/', async (req, res) => {
  try {
    const email = req.user?.email || '';
    const notifications = await req.prisma.notification.findMany({
      where: { user_email: email },
      orderBy: { created_at: 'desc' }, take: 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/:id/read — mark as read
router.put('/:id/read', async (req, res) => {
  try {
    await req.prisma.notification.update({ where: { id: req.params.id }, data: { is_read: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications — create notification (internal)
router.post('/', async (req, res) => {
  try {
    const { user_email, message, type } = req.body;
    if (!user_email || !message) return res.status(400).json({ error: 'user_email and message required' });
    const notification = await req.prisma.notification.create({
      data: { user_email, message, type: type || 'INFO' }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
