const express = require('express');
const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const p = req.prisma;
    const [total_volunteers, active_volunteers, total_reports, critical_reports, pending_needs, fulfilled_needs, total_dispatches, completed_dispatches] = await Promise.all([
      p.volunteer.count(),
      p.volunteer.count({ where: { status: 'ACTIVE' } }),
      p.report.count(),
      p.report.count({ where: { urgency_level: 'CRITICAL' } }),
      p.need.count({ where: { status: 'PENDING' } }),
      p.need.count({ where: { status: 'FULFILLED' } }),
      p.dispatch.count(),
      p.dispatch.count({ where: { status: 'COMPLETED' } }),
    ]);
    res.json({ total_volunteers, active_volunteers, total_reports, critical_reports, pending_needs, fulfilled_needs, total_dispatches, completed_dispatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
