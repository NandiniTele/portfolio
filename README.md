<<<<<<< HEAD
# RAMA VENKATA CHARAN — Full-stack portfolio

React (Vite) + Tailwind + Framer Motion frontend, FastAPI backend. Content is served from the API (`backend/data/portfolio.json`); the contact form POSTs to the backend.

## Prerequisites

- Node.js 20+ recommended  
- Python 3.11+

## Install dependencies

**Backend**

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

On macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Frontend**

```bash
cd frontend
npm install
```

You can also start the UI from the **repository root** (after `frontend` dependencies are installed): `npm run dev` — it runs Vite in `frontend/`.

## Run locally

**Terminal 1 — API (from `backend`, venv active)**

```bash
cd backend
.\.venv\Scripts\activate
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

**Terminal 2 — Frontend** (either of these)

From the `frontend` folder:

```bash
cd frontend
npm run dev
```

Or from the **repo root** (same command):

```bash
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/health` to `http://127.0.0.1:8001` (port **8001** avoids clashes with other tools that use 8000).

**If you still see “Failed to fetch”:** confirm the API is running (you should see Uvicorn logs). If something else is using **8001**, pick another port, start Uvicorn with that port, and set the same URL in `frontend/vite.config.js` under `server.proxy`.

**Environment (production build)**

- Copy `frontend/.env.example` to `frontend/.env.production` and set `VITE_API_URL` to your deployed API origin (no trailing slash), e.g. `https://your-api.onrender.com`.

**Backend CORS**

- Set `FRONTEND_ORIGINS` to a comma-separated list of allowed origins (your Vercel URL and local dev if needed), e.g. `https://your-app.vercel.app,http://localhost:5173`.

## Useful API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/portfolio` | Full JSON used by the SPA |
| GET | `/api/home`, `/api/about`, `/api/education`, `/api/skills`, `/api/projects`, `/api/certifications`, `/api/internships`, `/api/achievements`, `/api/contact-info` | Section slices |
| POST | `/api/contact` | Contact form (`name`, `email`, `message`) |
| GET | `/health` | Health check |

Messages are appended to `backend/data/contact_messages.jsonl`.

**Profile data:** Edit `backend/data/portfolio.json`. The API reloads that file when its modification time changes (no server restart needed in most cases). LinkedIn does not expose a full public profile API for hobby sites—use your LinkedIn page (or an AI prompt with your profile URL) to draft text, then paste into `certifications`, `internships`, and `achievements` in JSON form.

## Deploy

### Frontend — Vercel

1. Push the repo to GitHub.  
2. In [Vercel](https://vercel.com), **New Project** → import the repo.  
3. **Root Directory**: `frontend`.  
4. **Build command**: `npm run build`. **Output directory**: `dist`.  
5. **Environment variables**: `VITE_API_URL` = your Render API URL (HTTPS, no trailing slash).  
6. Deploy. Update FastAPI `FRONTEND_ORIGINS` to include your Vercel production URL.

### Backend — Render

1. In [Render](https://render.com), **New** → **Web Service** → connect the repo.  
2. **Root Directory**: `backend`.  
3. **Runtime**: Python 3.  
4. **Build command**: `pip install -r requirements.txt`.  
5. **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.  
6. **Environment**: set `FRONTEND_ORIGINS` to your Vercel URL (and optional preview URLs).  
7. After deploy, copy the service URL into `VITE_API_URL` on Vercel and redeploy the frontend if needed.

## Project layout

```
backend/
  main.py
  requirements.txt
  api/routes/       # REST routers
  models/           # Pydantic schemas
  services/         # JSON load + contact log
  data/
    portfolio.json
frontend/
  src/
    App.jsx
    main.jsx
    components/
    pages/
    styles/
    lib/
```

If you previously used the old single-folder Vite app at the repository root, remove its `node_modules` and use `frontend/` only.
=======
# portfolio
I’m a passionate B.Tech CSE student interested in software development, AI, and web technologies. I enjoy building real-world projects like intelligent systems, full-stack apps, and data-driven solutions. Through internships, certifications, and hands-on coding, I continuously improve my skills and explore innovative technologies.
>>>>>>> 569a94b0fa4a30803d2cfff3f9e850ee11d3eef6
