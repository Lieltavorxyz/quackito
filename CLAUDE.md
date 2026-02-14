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
| Database         | PostgreSQL (official image, StatefulSet) |
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

### Phase 3 — CI/CD + Kubernetes + ArgoCD (blocked — 3 fixes needed)
> Goal: Full DevOps pipeline — CI pushes images to GHCR, Helm deploys to minikube, ArgoCD auto-syncs.
>
> **Completed:**
> - Helm chart with templates (client deployment/service, server deployment/service, ingress)
> - PostgreSQL as StatefulSet using official `postgres:16-alpine` image (arm64-compatible)
> - Server config via K8s Secret (DB credentials from pre-existing secret `quackito-db-secret`)
> - Ingress routes: /api → server, / → client
> - GitHub Actions upgraded: lint/test client+server → build & push to GHCR → update Helm image tags
> - CI builds multi-arch images (linux/amd64 + linux/arm64) via QEMU + Docker Buildx
> - ArgoCD Application manifest (auto-sync from git, self-heal, prune)
> - CI pipeline fully green: lint → test → build → push GHCR → update Helm tags
> - Minikube cluster started with Docker driver (arm64, Apple Silicon)
> - ArgoCD installed and UI accessible (port-forward 8080)
> - Quackito namespace + DB secret created
> - ArgoCD Application applied — app synced
> - Replaced Bitnami PostgreSQL subchart with own StatefulSet (Bitnami image had no arm64 support)
> - PR workflow established (feature branches → PR → CI → squash merge)
> - Ingress correctly configured: `/api/(.*)` → server:3001, `/(.*)` → client:80 (address: 192.168.49.2)
> - ArgoCD tracking correct repo/branch/path, auto-sync with prune + self-heal enabled
>
> **Production note:** In production, PostgreSQL would be a managed service (RDS, Cloud SQL).
> The in-chart StatefulSet is for local minikube demo only.
>
> **Verified (agent run 2025-02-14):**
> - ArgoCD: OutOfSync / Degraded — correctly configured but blocked by issues below
> - PostgreSQL pod: ImagePullBackOff — old Bitnami StatefulSet stuck (immutable field update rejected by K8s)
> - Client + Server pods: CrashLoopBackOff — `exec format error` (amd64 images on arm64 minikube)
> - Ingress: configured correctly but no healthy backends
>
> **Remaining fixes (in order):**
- [ ] Delete old Bitnami StatefulSet + PVC: `kubectl delete statefulset quackito-postgresql -n quackito && kubectl delete pvc data-quackito-postgresql-0 -n quackito`
- [ ] Trigger CI to build multi-arch images: push any change to main (current tags `dc3a7db` predate multi-arch fix)
- [ ] Add /etc/hosts entry: `echo "192.168.49.2 quackito.local" | sudo tee -a /etc/hosts`
- [ ] After ArgoCD re-syncs, verify all 3 pods Running
- [ ] Test ingress: `curl http://quackito.local/` and `curl http://quackito.local/api/ducks`
- [ ] Verify end-to-end GitOps flow (push → CI → GHCR → ArgoCD → pods updated)

### Phase 4 — Core Loop: Food & Play
> Goal: Make the existing actions meaningful — not just buttons that change numbers.
>
> **4a — Food choices with different effects**
- [ ] Add food types (bread, seeds, berries) with different hunger/happiness modifiers
- [ ] Backend: new `food_type` param on feed endpoint, effect multipliers
- [ ] Frontend: food picker UI replacing single Feed button
- [ ] Files: `server/src/routes/`, `client/src/components/ActionButtons.tsx`, `useDuck` hook
>
> **4b — Play mini-game**
- [ ] Simple tap/catch mini-game (e.g., catch falling breadcrumbs)
- [ ] Game result determines happiness boost (score-based)
- [ ] New component + hook, launched from Play button
- [ ] Files: new `client/src/components/MiniGame.tsx`, `client/src/hooks/useMiniGame.ts`
>
> **4c — Sound effects**
- [ ] Action sounds (munch, splash, yawn) — short MP3/OGG clips
- [ ] `useSound` hook with mute toggle, persisted in localStorage
- [ ] Files: `client/src/hooks/useSound.ts`, `client/src/assets/sounds/`
>
> **4d — Loading & transition states**
- [ ] Skeleton loading state on first load
- [ ] Framer Motion page transitions
- [ ] Optimistic UI feedback improvements
- [ ] Files: `client/src/components/`, `App.tsx`

### Phase 5 — Progression: Aging, XP & Streaks
> Goal: Give a reason to come back daily — the duck grows and evolves.
>
> **5a — Duck aging / evolution**
- [ ] Three life stages: baby → duckling → adult
- [ ] Age based on total interactions or real time elapsed
- [ ] New art per stage (3 stages x 6 moods = 18 images, or recolor/resize existing)
- [ ] Backend: `stage` field on duck, promotion logic
- [ ] Files: `server/src/routes/`, `client/src/components/Duck.tsx`, new assets
>
> **5b — XP and leveling system**
- [ ] XP earned per action (feed=10, play=20, sleep=5)
- [ ] Level thresholds (level 1-20 curve)
- [ ] Level-up animation + notification
- [ ] Backend: `xp` and `level` fields, level-up calc in interaction endpoint
- [ ] Frontend: XP bar component, level badge
- [ ] Files: `server/src/routes/`, `client/src/components/XPBar.tsx`
>
> **5c — Streak tracking**
- [ ] Track consecutive days visited
- [ ] Streak counter display + streak-break warning
- [ ] Bonus XP for streak milestones (3, 7, 14, 30 days)
- [ ] Backend: `last_visit` and `streak` fields on duck
- [ ] Files: `server/src/routes/`, `client/src/components/StreakBadge.tsx`
>
> **5d — Daily events / surprises**
- [ ] Random daily event on first visit ("Quackito found a flower!")
- [ ] Event pool (10+ events) with different rewards (XP, mood boost)
- [ ] Toast/modal notification component
- [ ] Backend: `last_event_date` field, event selection logic
- [ ] Files: `server/src/routes/`, `client/src/components/DailyEvent.tsx`

### Phase 6 — Customization: Outfits & Shop
> Goal: The "dress up" promise — unlock and equip accessories.
>
> **6a — Outfit system**
- [ ] Accessory types: hats, bows, sunglasses, scarves
- [ ] Backend: `outfits` table (duck_id, item_id, equipped boolean)
- [ ] Accessories render as overlay on duck image (CSS positioned PNGs)
- [ ] Files: `server/src/db/`, `server/src/routes/`, `client/src/components/Duck.tsx`
>
> **6b — Shop UI**
- [ ] Shop modal/page with item grid
- [ ] Items unlocked by level (level 3 = bow, level 5 = hat, etc.)
- [ ] Equip/unequip toggle
- [ ] Files: `client/src/components/Shop.tsx`, `client/src/components/OutfitOverlay.tsx`

### Phase 7 — Duck Life: Animations & Personality
> Goal: The duck feels alive — not just a static image that changes.
>
> **7a — Idle animations**
- [ ] Duck waddles, looks around, preens feathers when no interaction
- [ ] Random idle behavior cycle (every 5-15 seconds)
- [ ] Framer Motion keyframe sequences
- [ ] Files: `client/src/components/Duck.tsx`, `client/src/hooks/useIdleAnimation.ts`
>
> **7b — Enhanced reaction animations**
- [ ] Unique multi-step animations per action (not just particles)
- [ ] Feed: duck pecks → chews → happy wiggle
- [ ] Play: duck jumps → spins → lands with sparkles
- [ ] Sleep: duck yawns → tucks head → zzz floats up
- [ ] Files: `client/src/components/Duck.tsx`
>
> **7c — Duck personality traits**
- [ ] Each duck gets 1-2 traits on creation (greedy, playful, sleepy, shy)
- [ ] Traits affect stat decay rates and animation preferences
- [ ] Backend: `traits` JSON field on duck, modifier logic
- [ ] Frontend: trait badge display, personality-influenced idle behavior
- [ ] Files: `server/src/routes/`, `client/src/components/PersonalityBadge.tsx`

### Phase 8 — PWA + Go Live
> Goal: Installable on her phone, deployed and shareable.
>
> **8a — PWA setup**
- [ ] Web App Manifest (icon, splash screen, theme color)
- [ ] Service Worker (offline caching with workbox)
- [ ] "Add to Home Screen" prompt
- [ ] Files: `client/public/manifest.json`, `client/src/sw.ts`
>
> **8b — Deploy**
- [ ] Deploy frontend to Vercel (free)
- [ ] Deploy backend to Railway or Render (free tier)
- [ ] Environment variables + production DB setup
- [ ] Verify end-to-end in production
>
> **8c — Push notifications (optional)**
- [ ] "Quackito misses you!" reminder after 24h absence
- [ ] Web Push API + service worker integration
- [ ] User opt-in flow
>
> **8d — Custom domain (optional)**
- [ ] Register domain (~$10/year)
- [ ] DNS + Vercel config

### Phase 9 — Monitoring & Observability
> Goal: Production-grade observability for DevOps portfolio.
>
> **9a — Prometheus metrics**
- [ ] `/metrics` endpoint on server (prom-client)
- [ ] Counters: requests, interactions by type, errors
- [ ] Histograms: response latency
- [ ] Files: `server/src/metrics.ts`, `server/src/index.ts`
>
> **9b — Grafana dashboard**
- [ ] Dashboard JSON (requests/sec, duck interactions, error rate, uptime)
- [ ] Helm: add Prometheus + Grafana to chart (or kube-prometheus-stack)
- [ ] Files: `helm/quackito/templates/`, `grafana/dashboards/`

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
│   ├── Chart.yaml          # Chart metadata
│   ├── values.yaml         # Image tags (set by CI), replicas, config
│   └── templates/          # K8s manifests (deployments, statefulset, services, ingress)
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
**Phase 1 ✅** | **Phase 2 ✅** | **Phase 3 — Blocked (3 fixes)** | **Phase 4 — In Progress** | **Phase 5-9 — Planned**

## Agent Workflow
See `agents.md` for the task playbook. Each phase is broken into agent-sized tasks
(labeled 4a, 4b, etc.) that can be assigned to a Claude Code agent via the Task tool.
Tasks within a phase can often run in parallel. Cross-phase dependencies are noted.

## Next Session — Pick Up Here
1. **Unblock Phase 3** — Delete old Bitnami StatefulSet, push to trigger multi-arch CI, add /etc/hosts
2. **Phase 4 in progress** — Core Loop: food choices (4a), mini-game (4b), sounds (4c), loading (4d)
3. **After Phase 4** — Phase 5 (progression) — aging, XP, streaks can run in parallel
