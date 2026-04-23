# Aegis Nexus: Complete Deployment & Execution Guide

This document provides step-by-step instructions for running the Aegis Nexus platform, validating its environment, and successfully running both the Front-End and Back-End services.

## Prerequisites
1. **Node.js** (v18+ recommended)
2. **PostgreSQL** database running locally on `localhost:5432` with username `aegis` and password `aegis_secure`, hosting a database named `aegis_nexus`.

---

## 1. Environment Configurations

You need exactly **two** `.env` files to run the full application. Make sure neither gets committed to your Git repository!

### A. Frontend Environment
Create or edit `services/frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### B. Backend Environment
Create or edit `services/backend/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
DATABASE_URL="postgresql://aegis:aegis_secure@localhost:5432/aegis_nexus"
```

---

## 2. Setting Up Google Authentication (OAuth)

Aegis Nexus uses secure JWT validation using Google OAuth.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Credentials**.
3. Create an **OAuth Client ID** for a Web Application.
4. Set Authorized JavaScript Origins to: `http://localhost:3000`
5. Copy the generated `Client ID` into both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend).

---

## 3. Database Initialization

The backend uses Prisma to ensure BCNF constraints. Before starting the backend, initialize the DB:
1. Open terminal and navigate to `services/backend`
2. Run: `npm install`
3. Run: `npx prisma db push` (This creates the required tables)

---

## 4. Boot Sequence

### 1. Start the Backend Orchestration Layer
1. Open a terminal to `services/backend`
2. Run: `npm install`
3. Run: `npm start` (or `npm run dev` for nodemon auto-refresh)
*Ensure it says "✅ Connected to PostgreSQL" and "🚀 Backend running on port 3001"*

### 2. Start the Frontend Application
1. Open another terminal to `services/frontend`
2. Run: `npm install`
3. Run: `npm run dev`
4. Open your browser to -> [http://localhost:3000](http://localhost:3000)

---

## Judging Checklist & Features
- **UI/UX**: Check `/login` for dynamic particles, gradient glows, and glassmorphism styling. Notice the smooth scrolling and custom fonts.
- **Authentication**: Try clicking Google Sign-In. You'll be redirected and securely authorized through Google's JWT network.
- **AI Triage**: Visit the NGO vault and upload a handwritten document or use the Voice recorder. The backend `Gemini 2.0 Flash` API structurally categorizes requests in JSON.
- **Live Heatmap**: Visit the Live Dispatch map. With valid Google Maps API keys mapped, observe custom stylized geospatial rendering.

*Made to impress! Ensure your API keys have billing active to witness Gemini + Heatmaps perfectly.*
