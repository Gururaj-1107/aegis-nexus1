const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const voiceRoutes = require('./routes/voice');
const documentRoutes = require('./routes/document');
const geminiRoutes = require('./routes/gemini');
const authRoutes = require('./routes/auth');
const volunteerRoutes = require('./routes/volunteers');
const announcementRoutes = require('./routes/announcements');
const dashboardRoutes = require('./routes/dashboard');
const dispatchRoutes = require('./routes/dispatch');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');
const knowledgeRoutes = require('./routes/knowledge');
const translateRoutes = require('./routes/translate');
const verifyGoogleToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// CORS — allow frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://aegis-frontend-75btxxix5a-uc.a.run.app', process.env.FRONTEND_URL].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Attach prisma to req for use in routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Health check (Unprotected)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aegis Nexus Backend',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_KEY',
      documentAI: !!process.env.DOCUMENT_AI_PROCESSOR_ID,
      speechToText: !!process.env.GOOGLE_CLOUD_PROJECT,
      database: 'connected'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Database Seeding Route (One-time setup, bypasses OAuth)
app.get('/api/seed', async (req, res) => {
  try {
    const localPrisma = req.prisma;
    const count = await localPrisma.volunteer.count();
    if (count > 0) return res.json({ message: 'Database already seeded.' });
    await localPrisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    const skills = ["MEDIC", "FOOD_AID", "EVAC", "SUPPLY", "SECURITY", "LOGISTICS", "COUNSELOR", "TECH_SUPPORT"];
    for (const sName of skills) {
      await localPrisma.skill.upsert({ where: { skill_name: sName }, update: {}, create: { skill_name: sName } });
    }
    const volunteers = [
      { first_name: "Aarav", last_name: "Sharma", phone: "+919876543210", current_lat: 19.076, current_lng: 72.8777, status: "ACTIVE", skills: ["MEDIC", "SECURITY"] },
      { first_name: "Priya", last_name: "Patel", phone: "+919876543211", current_lat: 23.0225, current_lng: 72.5714, status: "EN_ROUTE", skills: ["FOOD_AID"] },
      { first_name: "Rohit", last_name: "Verma", phone: "+919876543212", current_lat: 28.6139, current_lng: 77.209, status: "STANDBY", skills: ["SUPPLY"] }
    ];
    for (const v of volunteers) {
      const { skills: vSkills, ...vData } = v;
      await localPrisma.volunteer.create({
        data: { ...vData, skills: { create: vSkills.map(sName => ({ skill: { connect: { skill_name: sName } } })) } }
      });
    }
    res.json({ success: true, message: 'Registry populated with demo operatives.' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', message: err.message });
  }
});

// Public routes (no auth)
app.use('/api/volunteers/register', require('./routes/volunteerRegister'));

// Protected Routes
app.use('/api/voice', verifyGoogleToken, voiceRoutes);
app.use('/api/document', verifyGoogleToken, documentRoutes);
app.use('/api/gemini', verifyGoogleToken, geminiRoutes);
app.use('/api/volunteers', verifyGoogleToken, volunteerRoutes);
app.use('/api/announcements', verifyGoogleToken, announcementRoutes);
app.use('/api/dashboard', verifyGoogleToken, dashboardRoutes);
app.use('/api/dispatches', verifyGoogleToken, dispatchRoutes);
app.use('/api/dispatch', verifyGoogleToken, dispatchRoutes);
app.use('/api/analytics', verifyGoogleToken, analyticsRoutes);
app.use('/api/notifications', verifyGoogleToken, notificationRoutes);
app.use('/api/knowledge', verifyGoogleToken, knowledgeRoutes);
app.use('/api/translate', verifyGoogleToken, translateRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server immediately — Cloud Run requires PORT to be bound quickly
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aegis Nexus Backend running on port ${PORT}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'configured' : '⚠️  not set'}`);
  console.log(`🗺️  Document AI: ${process.env.DOCUMENT_AI_PROCESSOR_ID ? 'configured' : '⚠️  not set'}`);

  // Connect to DB in the background — don't block startup
  prisma.$connect()
    .then(() => console.log('✅ Connected to PostgreSQL via Prisma'))
    .catch((err) => console.error('⚠️  Database connection failed (running without DB):', err.message));
});
