# kdcnywatch

A personal full-stack dashboard for tracking and comparing Overwatch stats across a group of friends. Built as a solo project to explore full-stack development with React, Node.js, and REST API integration.

![Status](https://img.shields.io/badge/status-live-brightgreen)

## Live Demo

[kdcnywatch-frontend.vercel.app](https://kdcnywatch-frontend.vercel.app)

---

## Features

- Displays player profiles with avatars, titles, endorsement levels, and competitive rank icons
- Compares average per-10-minute stats (eliminations, damage, healing, deaths, KDA, winrate) across all tracked players in a shared table
- Highlights the best performer per stat category
- Interactive bar chart that syncs with the stat table — clicking a row updates the chart
- Manual stat refresh via a button that hits the backend and re-fetches live data from the OverFast API
- Add and remove tracked players directly from the dashboard
- Gracefully handles failed fetches per player without breaking the rest of the dashboard

---

## Tech Stack

### Frontend
- **React** - component-based UI
- **Vite** - fast dev server and build tool
- **Recharts** - data visualization and interactive bar charts
- **Axios** - HTTP client for backend communication
- **CSS Modules** - scoped, modular styling
- **Barlow** - Google Font matching Overwatch's aesthetic

### Backend
- **Node.js** - JavaScript runtime
- **Express** - REST API server
- **OverFast API** - unofficial Overwatch stats API
- **JSON file storage** - lightweight data persistence for player list and cached stats

### Infrastructure
- **Vercel** - frontend hosting with automatic GitHub deploys
- **Render** - backend hosting

---

## Architecture

```
Frontend (Vercel)
  └── React + Vite
        └── Axios → Backend (Render)
                      └── Express REST API
                            ├── OverFast API (external)
                            ├── players.json (tracked player list)
                            └── stats.json (cached stat data)
```

The backend acts as a proxy and cache layer. It fetches data from the OverFast API on demand and stores the results locally, so the frontend always reads from fast cached data rather than hitting the upstream API directly on every load.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/players` | Returns list of tracked players |
| GET | `/players/stats` | Returns cached stats for all players |
| GET | `/players/:tag/stats` | Returns cached stats for a specific player |
| POST | `/players/refresh` | Triggers a fresh fetch for all players |
| POST | `/players/add` | Adds a new player to the tracking list |
| DELETE | `/players/:tag` | Removes a player from the tracking list |
| GET | `/health` | Health check endpoint |

---

## Local Development

### Prerequisites
- Node.js v22+

### Backend

```bash
cd backend
npm install
node index.js
```

Create `backend/.env`:
```
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Create `backend/data/stats.json`:
```json
{}
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

---

## Deployment

- **Frontend** deployed to [Vercel](https://vercel.com) — auto-deploys on push to `main`
- **Backend** deployed to [Render](https://render.com) — auto-deploys on push to `main`

Set the following environment variables:

| Service | Variable | Value |
|---------|----------|-------|
| Render | `FRONTEND_URL` | Your Vercel production URL |
| Vercel | `VITE_API_URL` | Your Render service URL |
