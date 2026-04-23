const express = require('express');
const router = express.Router();

/**
 * GET /api/volunteers/seed
 * Remote seeding endpoint to populate database from the server.
 */
router.get('/seed', async (req, res) => {
  const { prisma } = req;
  try {
    // 1. Check if already seeded
    const count = await prisma.volunteer.count();
    if (count > 0) {
      return res.json({ message: 'Database already has data. Skipping seed.' });
    }

    // 2. Extension
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 3. Seed Skills
    const skills = ["MEDIC", "FOOD_AID", "EVAC", "SUPPLY", "SECURITY"];
    for (const sName of skills) {
      await prisma.skill.upsert({
        where: { skill_name: sName },
        update: {},
        create: { skill_name: sName }
      });
    }

    // 4. Seed Volunteers
    const volunteers = [
      { first_name: "Sarah", last_name: "Connor", phone: "+15550100", current_lat: 34.0522, current_lng: -118.2437, status: "ACTIVE", skills: ["MEDIC", "SECURITY"] },
      { first_name: "James", last_name: "Holden", phone: "+15550101", current_lat: 34.0622, current_lng: -118.2537, status: "EN_ROUTE", skills: ["SECURITY"] },
      { first_name: "Naomi", last_name: "Nagata", phone: "+15550102", current_lat: 34.0722, current_lng: -118.2637, status: "STANDBY", skills: ["SUPPLY"] }
    ];

    for (const v of volunteers) {
      const { skills: vSkills, ...vData } = v;
      await prisma.volunteer.create({
        data: {
          ...vData,
          skills: {
            create: vSkills.map(sName => ({
              skill: { connect: { skill_name: sName } }
            }))
          }
        }
      });
    }

    res.json({ message: 'Database seeded successfully with demo operatives.' });
  } catch (error) {
    console.error('[Seed Error]', error);
    res.status(500).json({ error: 'Seeding failed', message: error.message });
  }
});

/**
 * GET /api/volunteers
 * Returns a list of all networked agents/volunteers with their skills and locations.
 */
router.get('/', async (req, res) => {
  const { prisma } = req;
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      },
      orderBy: {
        first_name: 'asc'
      }
    });

    // Flatten skills for easier frontend consumption
    const flattened = volunteers.map(v => ({
      id: v.volunteer_id,
      name: `${v.first_name} ${v.last_name}`,
      role: v.skills.map(s => s.skill.skill_name).join(', '),
      location: `Lat: ${v.current_lat.toFixed(2)}, Lng: ${v.current_lng.toFixed(2)}`,
      status: v.status.charAt(0) + v.status.slice(1).toLowerCase().replace('_', '-')
    }));

    res.json(flattened);
  } catch (error) {
    console.error('[Volunteers Route] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch networked agents' });
  }
});

module.exports = router;
