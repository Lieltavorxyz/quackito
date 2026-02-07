# Quackito

A virtual pet duck PWA — feed it, play with it, watch it grow.
Built with modern DevOps practices end to end.

## The Idea
A cute duck lives on your screen. It gets hungry, sleepy, happy, or bored depending
on how you interact with it. It reacts to time of day (sleeps at night, active in morning).
She opens it daily, taps to feed, play, and dress up her duck.

## Decisions Made
- **Hosting**: Vercel (free) for the app. Minikube locally for K8s/ArgoCD demo.
- **Cost**: $0. Optional custom domain ~$10/year later.
- **Secrets**: Environment variables only. Never hardcoded.
- **Offline-first**: App works without backend, syncs when available.
- **Auth**: No login — unique duck code in the URL.

## Tech Stack

| Layer            | Tool                              |
|------------------|-----------------------------------|
| Frontend         | React + TypeScript (Vite)         |
| Styling          | CSS + Glassmorphism               |
| Duck Art         | Gemini-generated illustrations    |
| Animations       | Framer Motion + CSS               |
| Backend API      | Node.js + Express                 |
| Database         | PostgreSQL                        |
| Containerization | Docker + Docker Compose           |
| CI/CD            | GitHub Actions                    |
| GitOps           | ArgoCD                            |
| Orchestration    | Kubernetes + Helm (minikube)      |
| Hosting          | Vercel (free tier)                |

## Phases

### Phase 1 — Foundation ✅
> Everything needed to get a working app with backend, CI/CD, and basic gameplay.
>
> **Completed:**
> - React + TypeScript frontend (Vite) with ESLint + Jest
> - Express backend with PostgreSQL (ducks + interactions tables)
> - REST API with server-side decay calculation
> - Duck state engine (hunger, happiness, energy) with localStorage + API sync
> - 6 mood states with CSS animations (bounce, bob, wobble, droop, sway, pulse)
> - Time-of-day awareness (4 background gradients)
> - Feed / Play / Sleep actions with optimistic updates
> - Dockerfiles for client (nginx) and server (node)
> - Docker Compose (client + server + PostgreSQL)
> - GitHub Actions CI pipeline (lint → test → build → deploy)
> - Auth via unique duck code (nanoid), secrets via env vars only

### Phase 2 — Design & UI Overhaul (in progress)
> Goal: Make it look and feel like a 2026 app. Not generic — polished, cute, delightful.
>
> **Completed:**
> - Quicksand font for modern rounded typography
> - Framer Motion added for spring-physics animations
> - Custom duck art generated via Gemini — 6 mood images (happy, content, sad, hungry, tired, sleeping)
> - Custom action button icons generated via Gemini (cookie, paw+ball, sleeping duck)
> - Duck component rewritten: real PNG images per mood with unique Framer Motion animations
> - AnimatePresence for smooth transitions between mood states
> - Full CSS-drawn Background scene: sky gradients (4 times of day), animated clouds, sun/moon, stars at night, hills, grass, shimmering pond
> - Glassmorphism glass card (backdrop-filter blur, semi-transparent, soft borders)
> - StatusBars redesigned with Framer Motion spring-animated fills and gradient colors
> - ActionButtons redesigned with spring hover/tap physics and custom icon images
> - Mobile-first centered layout
> - Time-of-day greeting text
>
> **Remaining:**
- [ ] Particle effects and micro-interactions (hearts, sparkles on actions)
- [ ] Dark mode support
- [ ] Loading states and transitions between screens
- [ ] Sound design (subtle, toggleable)
- [ ] Clean up unused files (DuckSvg.tsx, original sprite sheets)

### Phase 3 — Duck Behavior & Personality
> Goal: The duck feels alive — not just numbers going up and down.
- [ ] Idle animations (duck waddles around, looks at things, preens feathers)
- [ ] Reaction animations (hearts when fed, sparkles when playing, zzz when sleeping)
- [ ] Duck personality traits (each duck is slightly different)
- [ ] Mini-games for "Play" action (not just a button press)
- [ ] Food choices for "Feed" (bread, seeds, berries — different effects)
- [ ] Duck aging / evolution (baby → duckling → adult)
- [ ] XP and leveling system
- [ ] Outfit / accessory shop (hats, bows, sunglasses — unlocked by level)
- [ ] Daily surprises / random events ("Quackito found a flower!")
- [ ] Streak tracking (consecutive days visiting)

### Phase 4 — PWA + Go Live
> Goal: Installable on her phone, deployed and shareable.
- [ ] Web App Manifest (icon, splash screen, theme color)
- [ ] Service Worker (offline caching)
- [ ] "Add to Home Screen" prompt
- [ ] Deploy frontend to Vercel (free)
- [ ] Deploy backend (Railway / Render free tier)
- [ ] Push notifications — "Quackito misses you!" (optional)
- [ ] Custom domain (optional)

### Phase 5 — Full DevOps Pipeline
> Goal: Production-grade infrastructure for DevOps portfolio.
- [ ] GitHub Actions: lint → test → build → push image → deploy
- [ ] Kubernetes manifests (deployment, service, ingress)
- [ ] Helm chart for parameterized deploys
- [ ] ArgoCD setup (push to main = auto deploy to minikube)
- [ ] Prometheus metrics endpoint
- [ ] Grafana dashboard (requests, duck interactions, uptime)

## Design Tools (recommended)
- **v0.dev** — Generate React + Tailwind UI from text descriptions
- **Midjourney / DALL-E** — Generate custom duck character illustrations
- **Rive** — Interactive vector animations (duck movement)
- **Figma** — Mockup the full UI before coding

## Project Structure
```
quackito/
├── client/                 # React PWA frontend
│   ├── src/
│   │   ├── components/     # Duck, StatusBars, ActionButtons
│   │   ├── hooks/          # useDuck, useTimeOfDay
│   │   ├── assets/         # Duck art, sounds
│   │   ├── api.ts          # Backend API client
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express API backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   └── db/             # Pool, schema, migrations
│   ├── Dockerfile
│   └── package.json
├── k8s/                    # Kubernetes manifests (Phase 5)
├── helm/                   # Helm chart (Phase 5)
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local dev (client + server + postgres)
├── .env.example            # Required env vars template
└── CLAUDE.md               # This file
```

## Commands
```bash
# Client
cd client && npm run dev       # Start React dev server (port 5173)
cd client && npm test          # Run frontend tests
cd client && npm run lint      # Lint frontend
cd client && npm run build     # Production build

# Server
cd server && npm run dev       # Start backend (port 3001)
cd server && npm start         # Production start

# Docker (full stack)
docker-compose up --build      # Client + Server + PostgreSQL
```

## Current Status
**Phase 1 — Complete** | **Phase 2 (Design) — In Progress**

## Next Session — Pick Up Here
1. **Build & verify** — Run `npm run build` in client/ to confirm all Phase 2 changes compile cleanly (icon imports, Framer Motion, Background component, etc.)
2. **Run dev server** — `npm run dev` and visually check the full redesign in browser
3. **Particle effects** — Add floating hearts when feeding, sparkles when playing, zzz particles when sleeping (micro-interactions)
4. **Clean up** — Remove `DuckSvg.tsx` (replaced by PNG images) and original Gemini sprite sheet files from assets/
5. **Fix tests** — Update existing tests to match new component structure (props changed, emoji → img)
6. **Dark mode** — Consider auto dark mode based on time-of-day (night = darker UI)
7. **Wrap Phase 2** — Mark complete, push, then start Phase 3 (Duck Behavior & Personality)
