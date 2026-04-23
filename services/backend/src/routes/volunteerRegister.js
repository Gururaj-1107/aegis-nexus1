const express = require('express');
const router = express.Router();

// POST /api/volunteers/register — public registration
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, phone, current_lat, current_lng, skills } = req.body;
    if (!first_name || !last_name || !phone || current_lat == null || current_lng == null) {
      return res.status(400).json({ error: 'first_name, last_name, phone, current_lat, current_lng required' });
    }
    const skillNames = skills || [];
    // Upsert skills
    for (const s of skillNames) {
      await req.prisma.skill.upsert({ where: { skill_name: s }, update: {}, create: { skill_name: s } });
    }
    const volunteer = await req.prisma.volunteer.create({
      data: {
        first_name, last_name, phone,
        current_lat: parseFloat(current_lat), current_lng: parseFloat(current_lng),
        status: 'AVAILABLE',
        skills: { create: skillNames.map(s => ({ skill: { connect: { skill_name: s } } })) }
      },
      include: { skills: { include: { skill: true } } }
    });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
