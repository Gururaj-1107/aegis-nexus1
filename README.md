<div align="center">

# 🛡️ AEGIS NEXUS

### AI-Powered NGO Volunteer Coordination & Dispatch Platform

[![Google Build for AI](https://img.shields.io/badge/Google%20Build%20for%20AI-Hackathon%202026-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-34A853?style=for-the-badge&logo=google-cloud&logoColor=white)](https://aegis-frontend-692786349296.us-central1.run.app)
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Powered-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com/vertex-ai)
[![Gemini](https://img.shields.io/badge/Gemini%202.0%20Flash-RAG%20Enabled-8E24AA?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/gemini)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **When disaster strikes, every second of coordination delay costs lives.**
> Aegis Nexus is a production-grade, agentic AI command center that digitizes NGO field reports, maps community needs in real time, and auto-dispatches the right volunteer to the right place — instantly.

<br/>

**[🌐 Live Platform](https://aegis-frontend-692786349296.us-central1.run.app) · [🔌 Backend API](https://aegis-backend-692786349296.us-central1.run.app/health) · [📽️ Demo Video](https://drive.google.com/file/d/1svMxEckyhTNAFTzlaYASAOP8MxRtpJaJ/view?usp=sharing)**

</div>

---

## The Problem

Local NGOs responding to floods, droughts, and urban crises collect community needs data through paper surveys and WhatsApp groups. This information stays fragmented — volunteers are mismatched to needs, critical zones go unserved, and coordinators make decisions blind. There is no unified system that ingests scattered field data, maps urgency by location, and intelligently assigns the right person to the right task.

---

## The Solution

Aegis Nexus is an end-to-end platform that solves this in five steps:

1. **Ingest** — Field workers upload handwritten or scanned reports. Google Document AI + Gemini 2.0 Flash extract structured need data (skill type, urgency, quantity, location) in under 2 seconds.
2. **Map** — Every extracted need is plotted on a live Google Map with a heatmap overlay showing critical zones. NGO coordinators see the full picture at a glance.
3. **Match** — The auto-dispatcher scores all available volunteers by skill match and Haversine proximity, selects the optimal assignment, and creates a dispatch record in one click.
4. **Communicate** — A Vertex AI RAG chatbot lets coordinators query all ingested field data in natural language — in English, Hindi, Gujarati, or Tamil.
5. **Track** — Volunteers update their status (EN_ROUTE → ARRIVED → COMPLETED). The analytics dashboard reflects outcomes in real time.

---

## Live Links

| Service | URL |
|---|---|
| Frontend (Cloud Run) | https://aegis-frontend-692786349296.us-central1.run.app |
| Backend API (Cloud Run) | https://aegis-backend-692786349296.us-central1.run.app/health |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Three.js, Recharts, Google Maps JavaScript API |
| **Backend** | Node.js 18, Express.js, Prisma ORM, PostgreSQL with pgvector |
| **AI / ML** | Gemini 2.0 Flash (RAG + document extraction), Vertex AI (text-embedding-gecko), Google Document AI, Google Speech-to-Text, Google Cloud Translation API |
| **Auth** | Google OAuth 2.0 — JWT verification via google-auth-library |
| **Infrastructure** | Google Cloud Run (containerized frontend + backend), Google Cloud SQL (PostgreSQL), Google Cloud Build (CI/CD), Google Container Registry, Docker |

---

## Core Features

**AI Document Ingestion** — Upload any handwritten or printed field report. Document AI performs OCR; Gemini 2.0 Flash structures the output into a typed schema (skill, urgency, quantity, coordinates, summary). The result is saved as a Report + linked Needs automatically — zero manual data entry.

**Smart Auto-Dispatcher** — For any open Need, the platform scores all volunteers with the matching skill by Haversine distance from the NGO center. The highest-scoring available volunteer is dispatched in one click. Status updates propagate instantly across the dashboard.

**Live Volunteer & Needs Map** — Google Maps integration with custom SVG markers per volunteer status (ACTIVE, EN_ROUTE, STANDBY) and NGO Center markers. A heatmap layer visualizes critical report density by zone, weighted by urgency level.

**Vertex AI RAG Knowledge Vault** — Field reports and knowledge base entries are embedded using Vertex AI's text-embedding-gecko model and stored as 768-dimensional vectors in pgvector. On every chat query, a cosine similarity search retrieves the top-3 relevant chunks and injects them as context into the Gemini prompt — grounding every answer in real operational data.

**Voice Command Input** — Coordinators record voice notes directly in the browser. Google Speech-to-Text transcribes the audio and routes the text through the same AI extraction pipeline as document uploads.

**Multilingual Chat** — The AI chat interface supports Hindi, Gujarati, and Tamil. User messages are auto-translated to English before reaching Gemini; responses are translated back to the selected language before display — powered by Google Cloud Translation API.

**Real-Time Analytics Dashboard** — Charts built with Recharts show volunteer skill distribution, report urgency breakdown (LOW / MEDIUM / CRITICAL), dispatch fulfillment rate over time, and NGO center activity leaderboard. All data is live from the database.

**Volunteer Self-Registration** — Volunteers register independently via a public form with map-based location picking and multi-skill selection. No admin action required.

**Announcements & Notifications** — Admins post priority announcements (NORMAL / URGENT / CRITICAL) visible to all users. An in-app notification system tracks critical events (new CRITICAL report, dispatch failure) with an unread badge in the header.

**C++ Spatial Matcher Microservice** — A dedicated C++ service handles high-throughput geospatial matching computations, running as a separate Docker container alongside the Node.js backend.

---

## Google APIs Used

| API | How It Is Used |
|---|---|
| Gemini 2.0 Flash | Document extraction (structured JSON from raw text), RAG chatbot responses, voice transcript analysis |
| Vertex AI (text-embedding-gecko) | Converts field report text into 768-dimensional vectors stored in pgvector for semantic search |
| Google Document AI | OCR and handwriting recognition on uploaded field report images and PDFs |
| Google Speech-to-Text | Transcribes voice command recordings from NGO coordinators |
| Google Cloud Translation API | Bidirectional translation between English and Hindi, Gujarati, Tamil in the chat interface |
| Google Maps JavaScript API | Live volunteer map, NGO center markers, heatmap layer, self-registration location picker |
| Google OAuth 2.0 | JWT-based authentication — all protected API routes verify the Google ID token |
| Google Cloud Run | Hosts the containerized Next.js frontend and Node.js backend with auto-scaling |
| Google Cloud SQL | Managed PostgreSQL instance with pgvector extension for vector similarity search |
| Google Cloud Build | CI/CD pipeline — every push to `main` triggers a full rebuild and redeploy |
| Google Container Registry | Stores Docker images for all three services |

---

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/volunteers` | List all volunteers with skills and status |
| `GET` | `/api/volunteers/:id` | Get a volunteer by ID |
| `POST` | `/api/volunteers` | Register a new volunteer |
| `PATCH` | `/api/volunteers/:id/status` | Update volunteer status |
| `GET` | `/api/reports` | List all community need reports |
| `POST` | `/api/reports` | Submit a new report |
| `GET` | `/api/dispatches` | List all dispatches |
| `POST` | `/api/dispatch` | Create a volunteer dispatch |
| `POST` | `/api/dispatch/auto` | Auto-dispatch best-matched volunteer to a need |
| `PATCH` | `/api/dispatches/:id/status` | Update dispatch status |
| `POST` | `/api/ai/chat` | RAG-powered Gemini chat |
| `POST` | `/api/ai/analyze-document` | Upload and parse document via Document AI |
| `POST` | `/api/ai/transcribe` | Transcribe audio via Speech-to-Text |
| `POST` | `/api/ai/translate` | Translate text via Cloud Translation API |
| `POST` | `/api/agent/ingest-knowledge` | Embed and store a knowledge base entry via Vertex AI |
| `GET` | `/api/analytics/summary` | Aggregated platform metrics |
| `GET` | `/api/analytics/timeline` | Report count over the last 30 days |
| `GET` | `/api/announcements` | List all announcements |
| `POST` | `/api/announcements` | Create an announcement |
| `GET` | `/api/notifications/:email` | Get notifications for a user |
| `PUT` | `/api/notifications/:id/read` | Mark a notification as read |

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Express server port (default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string (Cloud SQL) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID |
| `DOCUMENT_AI_PROCESSOR_ID` | Document AI processor ID |
| `FRONTEND_URL` | Frontend URL added to CORS allowlist |
| `MATCHER_URL` | Internal URL of the C++ spatial matcher service |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend Cloud Run service URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Gemini API key for client-side features |

---

## Getting Started Locally

**Prerequisites:** Docker Desktop, Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/Gururaj-1107/aegis-nexus.git
cd aegis-nexus

# 2. Install dependencies
cd services/backend && npm install
cd ../frontend && npm install && cd ../..

# 3. Configure environment variables
cp services/backend/.env.example services/backend/.env
cp services/frontend/.env.local.example services/frontend/.env.local
# Fill in your actual API keys in both files

# 4. Start the PostgreSQL database and C++ matcher
docker-compose up -d db cpp_matcher

# 5. Push schema and seed the database
cd services/backend
npx prisma db push
npx prisma db seed

# 6. Start both services
npm run dev                          # backend → http://localhost:3001
cd ../frontend && npm run dev        # frontend → http://localhost:3000
```

---

## Deployment

The platform is deployed on Google Cloud Run. Every push to the `main` branch triggers Cloud Build, which rebuilds all Docker images, pushes them to Container Registry, and redeploys both services automatically.

To manually redeploy a single service:

```bash
# Frontend only
docker build -t gcr.io/PROJECT_ID/aegis-frontend ./services/frontend
docker push gcr.io/PROJECT_ID/aegis-frontend
gcloud run deploy aegis-frontend --image gcr.io/PROJECT_ID/aegis-frontend --region us-central1 --allow-unauthenticated

# Backend only
docker build -t gcr.io/PROJECT_ID/aegis-backend ./services/backend
docker push gcr.io/PROJECT_ID/aegis-backend
gcloud run deploy aegis-backend --image gcr.io/PROJECT_ID/aegis-backend --region us-central1 --allow-unauthenticated
```

When Prisma models change, apply migrations before redeploying:

```bash
cd services/backend
npx prisma migrate deploy
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using conventional commits: `git commit -m "feat: describe your change"`
4. Push and open a Pull Request against `main`

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for the **Google Build for AI Hackathon 2026**

*Coordinate · Dispatch · Impact*

</div>
