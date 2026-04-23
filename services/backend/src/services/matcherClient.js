const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MATCHER_URL = process.env.MATCHER_URL || 'http://localhost:8080';

async function dispatchMatcher(reqData) {
  // 1. Fetch available volunteers from DB using Prisma
  const volunteersList = await prisma.volunteer.findMany({
    where: { status: 'AVAILABLE' },
    include: {
      skills: {
        include: { skill: true }
      }
    }
  });

  const volunteers = volunteersList.map(v => ({
    id: v.volunteer_id,
    lat: v.current_lat,
    lng: v.current_lng,
    skills: v.skills.map(vs => vs.skill.skill_name)
  }));

  if (volunteers.length === 0) {
     return null; // No one available
  }

  // 2. Build tree dynamically in C++ matcher
  try {
     await axios.post(`${MATCHER_URL}/build`, { volunteers });
  } catch (err) {
     console.error("Failed to build matcher tree:", err.message);
     return null;
  }

  // 3. Find match
  try {
     const matchResponse = await axios.post(`${MATCHER_URL}/match`, {
        lat: reqData.lat,
        lng: reqData.lng,
        skill: reqData.skill
     });
     
     if (matchResponse.data.status === 'found') {
        return matchResponse.data.volunteer;
     }
  } catch (err) {
     console.error("Failed to find match:", err.message);
  }

  return null;
}

module.exports = { dispatchMatcher };
