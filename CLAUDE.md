# Quackito

A virtual pet duck PWA — feed it, play with it, watch it grow.
Built with modern DevOps practices end to end.

## The Idea
A cute duck lives on your screen. It gets hungry, sleepy, happy, or bored depending
on how you interact with it. It reacts to time of day (sleeps at night, active in morning).
She opens it daily, taps to feed, play, and dress up her duck.

## Decisions Made
- **Duck style**: Emoji + CSS animations to start. Upgrade to SVG/Lottie later.
- **Storage**: localStorage first (no backend needed early on). Add DB in Phase 3 if needed.
- **Hosting**: Vercel (free) for the app she uses. Minikube locally for K8s/ArgoCD demo.
- **Cost**: $0. Optional custom domain ~$10/year later.
- **No backend in Phase 1-2**: Duck logic runs entirely in the browser.

## Tech Stack

| Layer            | Tool                              | When         |
|------------------|-----------------------------------|--------------|
| Frontend         | React + TypeScript (Vite)         | Phase 1      |
| Storage (early)  | localStorage                      | Phase 2      |
| PWA              | Service Worker + Web Manifest     | Phase 4      |
| Backend API      | Node.js + Express                 | Phase 3      |
| Database         | Supabase or PostgreSQL            | Phase 3      |
| Containerization | Docker + Docker Compose           | Phase 1      |
| CI/CD            | GitHub Actions                    | Phase 1      |
| GitOps           | ArgoCD                            | Phase 6      |
| Orchestration    | Kubernetes + Helm (minikube)      | Phase 6      |
| Monitoring       | Prometheus + Grafana (bonus)      | Phase 6      |
| Hosting          | Vercel (free tier)                | Phase 4      |

## Duck Mechanics
- **Hunger**: Decreases over time. Feed the duck to restore it.
- **Happiness**: Decreases over time. Play with the duck to restore it.
- **Energy**: Decreases with activity. Duck sleeps at night to recharge.
- **Mood**: Derived from hunger + happiness + energy. Affects duck's expression.
- **Level/Growth**: Duck earns XP from interactions. Levels up over time.
- **Outfits**: Unlock cosmetics as the duck levels up (hats, bows, sunglasses).
- **Time awareness**: Duck sleeps at night, is energetic in morning, lazy in afternoon.

## Phases

### Phase 1 — Project Foundation ✅
> Goal: Repo setup, React app running locally, CI on PRs.
- [x] Initialize git repo + CLAUDE.md
- [x] React + TypeScript frontend (Vite) in `/client`
- [x] Basic landing page with duck emoji placeholder
- [x] ESLint + Jest setup (3 tests passing)
- [x] Dockerfile for frontend (multi-stage: build + nginx)
- [x] Docker Compose for local dev
- [x] GitHub Actions CI pipeline (lint + test on every PR, build on main)
- [x] Push to GitHub

### Phase 2 — The Duck Comes Alive
> Goal: A duck appears on screen, has stats, and reacts to interactions.
- [ ] Duck component (emoji 🦆 + CSS animations: idle bounce, wiggle, blink)
- [ ] Duck state engine with localStorage (hunger, happiness, energy)
- [ ] State decay over time (hunger/happiness drop while app is closed)
- [ ] Core actions: Feed, Play, Put to Sleep
- [ ] Status bars (hunger, happiness, energy)
- [ ] Duck mood/expression changes based on stats
- [ ] Time-of-day awareness (background + duck behavior changes)
- [ ] Mobile-first responsive layout

### Phase 3 — Persistence + Backend
> Goal: Duck state syncs to a server. Works across devices.
- [ ] Node.js + Express backend in `/server`
- [ ] Database schema (duck state, interactions log)
- [ ] REST API: GET/PUT duck state, POST interactions
- [ ] Backend calculates state decay (hunger drops while away)
- [ ] Frontend syncs with API
- [ ] Simple auth (unique link or code — no login wall)
- [ ] Backend tests + lint
- [ ] Add backend to Docker Compose and CI pipeline

### Phase 4 — PWA + Mobile Experience
> Goal: Installable on her phone, feels like a real app.
- [ ] Web App Manifest (icon, name, theme color, splash screen)
- [ ] Service Worker (offline caching)
- [ ] "Add to Home Screen" prompt
- [ ] Deploy to Vercel (free)
- [ ] Push notifications — "Your duck is hungry!" (optional)

### Phase 5 — Leveling, Outfits, Polish
> Goal: Progression system that keeps her coming back.
- [ ] XP from interactions, level-up milestones
- [ ] Duck evolves at level thresholds (baby → teen → adult)
- [ ] Outfit shop: hats, bows, sunglasses (unlocked by level)
- [ ] Animations: eating, playing, sleeping, leveling up
- [ ] Sound effects (quack on tap, munch on feed)
- [ ] Easter eggs and personal touches

### Phase 6 — Full DevOps Pipeline
> Goal: Production-grade infrastructure for DevOps portfolio.
- [ ] Dockerfiles for frontend (nginx) and backend (node)
- [ ] GitHub Actions: lint → test → build → push image
- [ ] Kubernetes manifests (deployment, service, ingress)
- [ ] Helm chart for parameterized deploys
- [ ] ArgoCD setup (push to main = auto deploy to minikube)
- [ ] Prometheus metrics endpoint on backend
- [ ] Grafana dashboard (requests, duck interactions, uptime)

## Project Structure
```
quackito/
├── client/                 # React PWA frontend
│   ├── src/
│   │   ├── components/     # Duck, StatusBars, ActionButtons
│   │   ├── hooks/          # useDuck, useTime
│   │   ├── assets/         # Duck sprites, sounds
│   │   └── App.tsx
│   ├── public/
│   │   └── manifest.json   # PWA manifest
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express API (Phase 3+)
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── k8s/                    # Kubernetes manifests (Phase 6)
├── helm/                   # Helm chart (Phase 6)
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local dev environment
└── CLAUDE.md               # This file
```

## Commands
```bash
# Client
cd client && npm run dev     # Start React dev server
cd client && npm test        # Run frontend tests
cd client && npm run lint    # Lint frontend

# Docker
docker-compose up --build    # Run everything locally

# Server (Phase 3+)
cd server && npm run dev     # Start backend dev server
cd server && npm test        # Run backend tests
```

## Current Status
**Phase 1 — Complete** | Phase 2 — Next
