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
- **Secrets**: K8s Secrets (created manually), env vars in pods. Never in git.
- **Offline-first**: App works without backend, syncs when available.
- **Auth**: No login — unique duck code in the URL.
- **Docker Registry**: GitHub Container Registry (ghcr.io)
- **GitOps**: ArgoCD watches `helm/quackito/` in main branch, auto-deploys to minikube.

## Tech Stack

| Layer            | Tool                              |
|------------------|-----------------------------------|
| Frontend         | React + TypeScript (Vite)         |
| Styling          | CSS + Glassmorphism               |
| Duck Art         | Gemini-generated illustrations    |
| Animations       | Framer Motion + CSS               |
| Backend API      | Node.js + Express                 |
| Database         | PostgreSQL (Bitnami Helm chart)   |
| Containerization | Docker + Docker Compose           |
| CI/CD            | GitHub Actions → GHCR             |
| GitOps           | ArgoCD (auto-sync from git)       |
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

### Phase 2 — Design & UI Overhaul ✅
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
> - Particle effects on actions (hearts/sparkles/zzz via Framer Motion)
> - Cleaned up unused files (DuckSvg.tsx, Gemini sprite sheets)
> - Fixed tests for new component structure
>
> **Deferred to later phases:**
> - Dark mode support
> - Sound design
> - Loading states

### Phase 3 — CI/CD + Kubernetes + ArgoCD (in progress)
> Goal: Full DevOps pipeline — CI pushes images to GHCR, Helm deploys to minikube, ArgoCD auto-syncs.
>
> **Completed:**
> - Helm chart with templates (client deployment/service, server deployment/service, ingress)
> - Bitnami PostgreSQL as Helm subchart dependency
> - Server config via ConfigMap + K8s Secret (DB credentials from pre-existing secret)
> - Ingress routes: /api → server, / → client
> - GitHub Actions upgraded: lint/test client+server → build & push to GHCR → update Helm image tags
> - ArgoCD Application manifest (auto-sync from git, self-heal, prune)
> - .gitignore updated for Helm chart dependencies
>
> **Remaining:**
- [ ] Test full deploy on minikube (start cluster, install ArgoCD, deploy)
- [ ] Verify end-to-end GitOps flow (push → CI → GHCR → ArgoCD → pods updated)

### Phase 4 — Duck Behavior & Personality
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

### Phase 5 — PWA + Go Live
> Goal: Installable on her phone, deployed and shareable.
- [ ] Web App Manifest (icon, splash screen, theme color)
- [ ] Service Worker (offline caching)
- [ ] "Add to Home Screen" prompt
- [ ] Deploy frontend to Vercel (free)
- [ ] Deploy backend (Railway / Render free tier)
- [ ] Push notifications — "Quackito misses you!" (optional)
- [ ] Custom domain (optional)

### Phase 6 — Monitoring & Observability
> Goal: Production-grade observability for DevOps portfolio.
- [ ] Prometheus metrics endpoint on server
- [ ] Grafana dashboard (requests, duck interactions, uptime)

## Project Structure
```
quackito/
├── client/                 # React PWA frontend
│   ├── src/
│   │   ├── components/     # Duck, StatusBars, ActionButtons, Particles, Background
│   │   ├── hooks/          # useDuck, useTimeOfDay, useParticles
│   │   ├── assets/         # Duck art (6 moods), action icons (3)
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
├── helm/quackito/          # Helm chart
│   ├── Chart.yaml          # Chart metadata + bitnami/postgresql dependency
│   ├── values.yaml         # Image tags (set by CI), replicas, config
│   └── templates/          # K8s manifests (deployments, services, ingress)
├── argocd/
│   └── application.yaml    # ArgoCD Application (watches helm/quackito/ in git)
├── .github/workflows/      # CI/CD pipeline
│   └── ci.yml              # Lint → Test → Build → Push GHCR → Update Helm tags
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

# Helm
helm dependency build helm/quackito/   # Download postgresql subchart
helm lint helm/quackito/               # Validate chart
helm template quackito helm/quackito/  # Render templates (dry run)
```

## Minikube + ArgoCD Setup
```bash
# 1. Start cluster
minikube start
minikube addons enable ingress

# 2. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Get admin password:
argocd admin initial-password -n argocd

# 4. Create DB secret (before first deploy)
kubectl create namespace quackito
kubectl create secret generic quackito-db-secret -n quackito \
  --from-literal=DB_USER=quackito \
  --from-literal=DB_PASSWORD=<your-password>

# 5. Deploy via ArgoCD
kubectl apply -f argocd/application.yaml

# 6. Access the app
# Add to /etc/hosts: <minikube-ip> quackito.local
# Then open http://quackito.local
```

## Current Status
**Phase 1 — Complete** | **Phase 2 — Complete** | **Phase 3 (CI/CD + K8s + ArgoCD) — In Progress**

## Next Session — Pick Up Here
1. **Test minikube deploy** — Start minikube, install ArgoCD, create secret, apply application.yaml
2. **Verify pods** — All 3 pods (client, server, postgresql) running and healthy
3. **Test ingress** — Access app via quackito.local, verify API at /api/ducks
4. **Push to trigger CI** — Commit, push, verify GitHub Actions builds and pushes to GHCR
5. **Verify GitOps loop** — CI updates values.yaml tag → ArgoCD auto-syncs → new pods roll out
6. **Mark Phase 3 complete** — Then decide: Phase 4 (duck behavior) or Phase 5 (PWA)
