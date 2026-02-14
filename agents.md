# Quackito — Agent Task Playbook

How to use: each task below is a self-contained unit of work for a Claude Code agent
(via the `Task` tool). Copy the prompt into a Task call, or reference by ID (e.g., "do task 4a").

Tasks within the same phase can often run **in parallel** unless noted.
Cross-phase dependencies are listed per task.

---

## Phase 3 — Finish K8s (blocked — needs manual fixes)

### Task 3.1–3.3 — Verification ✅ DONE
> Ran 2025-02-14. Found 3 blocking issues (see below).

**Findings:**
- PostgreSQL: ImagePullBackOff — old Bitnami StatefulSet stuck (K8s rejects immutable field updates)
- Client + Server: CrashLoopBackOff — `exec format error` (amd64 images on arm64 minikube)
- ArgoCD: OutOfSync / Degraded — config correct, blocked by StatefulSet issue
- Ingress: configured correctly (routes, address assigned), no healthy backends

### Task 3.4 — Fix: Delete old Bitnami StatefulSet + PVC
```
Agent type: Bash
Prompt: |
  Delete the old Bitnami PostgreSQL resources so ArgoCD can recreate with postgres:16-alpine:
  1. kubectl delete statefulset quackito-postgresql -n quackito
  2. kubectl delete pvc data-quackito-postgresql-0 -n quackito
  3. Verify: kubectl get statefulset -n quackito && kubectl get pvc -n quackito
  Report: what was deleted, current state.
```

### Task 3.5 — Fix: Trigger multi-arch CI build
```
Agent type: Bash
Prompt: |
  The current GHCR image tags (dc3a7db) predate the multi-arch CI fix.
  Need to trigger a new CI run that builds linux/amd64 + linux/arm64 images.
  Option A: Push any small change to main (e.g., whitespace in CLAUDE.md)
  Option B: Manually re-run the CI workflow via: gh workflow run ci.yml
  After CI completes, verify new image tags in helm/quackito/values.yaml.
  Report: new image tags, CI run status.
```
**Depends on:** 3.4

### Task 3.6 — Fix: Add /etc/hosts entry
```
Agent type: Bash
Prompt: |
  Add quackito.local to /etc/hosts pointing to minikube IP:
  1. Verify minikube IP: minikube ip (expect 192.168.49.2)
  2. Check current /etc/hosts: grep quackito /etc/hosts
  3. If missing: echo "192.168.49.2 quackito.local" | sudo tee -a /etc/hosts
  4. Verify: ping -c1 quackito.local
  Report: entry added or already present.
```

### Task 3.7 — Final verification (after fixes)
```
Agent type: Bash
Prompt: |
  After fixes 3.4-3.6, verify everything works:
  1. kubectl get pods -n quackito (all 3 Running)
  2. kubectl get application quackito -n argocd (Synced + Healthy)
  3. curl http://quackito.local/ (200)
  4. curl http://quackito.local/api/ducks (200 or valid JSON)
  Report: pod statuses, ArgoCD status, HTTP responses.
```
**Depends on:** 3.4, 3.5, 3.6

---

## Phase 4 — Core Loop: Food & Play

### Task 4a — Food choices with different effects
```
Agent type: general-purpose
Prompt: |
  Add food choices to the Feed action in Quackito. Currently Feed is a single button press.

  Backend changes (server/src/routes/):
  - Modify the feed/interact endpoint to accept a `food_type` param
  - Food types: "bread" (+15 hunger, +5 happiness), "seeds" (+10 hunger, +10 happiness),
    "berries" (+5 hunger, +15 happiness)
  - Default to "bread" if no type specified (backward compatible)

  Frontend changes:
  - Replace the single Feed button with a food picker (3 food options)
  - Show food options on tap/click of a "Feed" area — could be a popup or inline row
  - Each food shows its name + small icon
  - Trigger the existing feed action with the selected food_type
  - Update useDuck hook to pass food_type to API

  Files to modify:
  - server/src/routes/ (feed endpoint)
  - client/src/components/ActionButtons.tsx (food picker UI)
  - client/src/hooks/useDuck.ts (pass food_type)
  - client/src/api.ts (add food_type param)

  Test: existing tests should still pass, add tests for new food types.
  Run: cd client && npm test; cd server && npm test (if server tests exist)
```
**Parallel with:** 4b, 4c, 4d

### Task 4b — Play mini-game
```
Agent type: general-purpose
Prompt: |
  Add a simple mini-game that triggers when the user taps "Play" in Quackito.

  Game concept: "Catch the Breadcrumbs"
  - Breadcrumbs fall from the top of a small game area
  - User taps/clicks to catch them (duck moves left/right or crumbs just need tapping)
  - 10-second round, score = crumbs caught
  - Score determines happiness boost: 0-3 = +5, 4-7 = +15, 8+ = +25

  Implementation:
  - New component: client/src/components/MiniGame.tsx
  - New hook: client/src/hooks/useMiniGame.ts (game state, timer, score)
  - MiniGame renders in a modal/overlay when Play is pressed
  - On game end, call the existing play/interact endpoint with score modifier
  - Framer Motion for falling breadcrumb animation
  - Touch-friendly (tap targets, mobile viewport)

  Integration:
  - Modify ActionButtons.tsx: Play button opens MiniGame instead of direct API call
  - Modify useDuck hook: accept happiness modifier from game result

  Keep it simple — this is v1, can be polished later.
```
**Parallel with:** 4a, 4c, 4d

### Task 4c — Sound effects
```
Agent type: general-purpose
Prompt: |
  Add sound effects to Quackito actions.

  Create a useSound hook (client/src/hooks/useSound.ts):
  - Exposes: playSound(name), isMuted, toggleMute
  - Mute state persisted in localStorage
  - Sounds are short (<1s) audio clips

  Sound mapping:
  - feed: munching/chomping sound
  - play: splash/quack sound
  - sleep: gentle yawn sound
  - levelUp: cheerful chime (for future use)

  For now, use free sounds from a CDN or generate simple ones.
  Place audio files in client/src/assets/sounds/
  Supported formats: MP3 with OGG fallback

  UI: Add a small mute/unmute icon button in the top-right corner of the glass card.

  Integration:
  - Call playSound('feed') in useDuck when feed action fires (same for play, sleep)
  - Files: new useSound.ts hook, modify useDuck.ts, modify App.tsx (mute button)
```
**Parallel with:** 4a, 4b, 4d

### Task 4d — Loading & transition states
```
Agent type: general-purpose
Prompt: |
  Add loading and transition states to Quackito.

  1. Initial load skeleton:
     - Show a pulsing glass card with placeholder shapes while duck data loads
     - Framer Motion fade-in when data arrives
     - File: new client/src/components/LoadingSkeleton.tsx

  2. Action feedback:
     - Brief button disabled state after action (prevent spam clicks, 1s cooldown)
     - Subtle scale animation on the duck when action is processing
     - File: modify ActionButtons.tsx, Duck.tsx

  3. Page transition:
     - AnimatePresence wrapper on main content in App.tsx
     - Smooth mount/unmount if switching views (prep for shop/mini-game modals)

  Keep changes minimal — this is polish, not new features.
```
**Parallel with:** 4a, 4b, 4c

---

## Phase 5 — Progression: Aging, XP & Streaks

### Task 5a — Duck aging / evolution
```
Agent type: general-purpose
Prompt: |
  Add duck aging to Quackito. Three life stages: baby → duckling → adult.

  Backend:
  - Add `stage` field to ducks table (varchar, default 'baby')
  - Add `total_interactions` counter field
  - Promotion thresholds: baby→duckling at 50 interactions, duckling→adult at 200
  - Check promotion on every interaction, update stage if threshold crossed
  - Return stage in duck API response

  Frontend:
  - Duck.tsx: select image set based on stage
  - For now, use the existing mood images but scale them:
    baby = 60% size, duckling = 80% size, adult = 100% size
  - Show stage label ("Baby Quackito", "Duckling Quackito", "Quackito")
  - Stage-up celebration animation (confetti/sparkles) when promoted

  DB migration: ALTER TABLE ducks ADD COLUMN stage, ADD COLUMN total_interactions
  Files: server/src/db/, server/src/routes/, client/src/components/Duck.tsx, useDuck hook
```
**Depends on:** Phase 4 complete (food types and play modify interaction flow)

### Task 5b — XP and leveling system
```
Agent type: general-purpose
Prompt: |
  Add XP and leveling to Quackito.

  Backend:
  - Add `xp` (integer, default 0) and `level` (integer, default 1) to ducks table
  - XP per action: feed=10, play=20, sleep=5
  - Level curve: level N requires N*100 XP (level 2=200, level 3=300, etc.)
  - Max level: 20
  - On interaction: add XP, check level-up, return new xp/level in response

  Frontend:
  - New XPBar component: shows current XP / next level threshold
  - Animated fill bar (Framer Motion spring, like StatusBars)
  - Level badge next to duck name
  - Level-up animation: golden glow + "Level Up!" text + sound trigger

  Files: server/src/db/, server/src/routes/, client/src/components/XPBar.tsx
  DB migration: ALTER TABLE ducks ADD COLUMN xp, ADD COLUMN level
```
**Parallel with:** 5c, 5d | **Depends on:** 5a (shares DB migration)

### Task 5c — Streak tracking
```
Agent type: general-purpose
Prompt: |
  Add daily visit streak tracking to Quackito.

  Backend:
  - Add `last_visit_date` (date) and `streak` (integer, default 0) to ducks table
  - On any interaction: if last_visit_date < today, increment streak and update date
  - If last_visit_date < yesterday, reset streak to 1
  - Streak milestones (3, 7, 14, 30 days) grant bonus XP (50, 100, 200, 500)

  Frontend:
  - StreakBadge component: flame icon + streak count
  - Milestone celebration (toast notification)
  - Position: top of glass card, next to greeting

  Files: server/src/routes/, client/src/components/StreakBadge.tsx
  DB migration: ALTER TABLE ducks ADD COLUMN last_visit_date, ADD COLUMN streak
```
**Parallel with:** 5b, 5d | **Depends on:** 5a

### Task 5d — Daily events / surprises
```
Agent type: general-purpose
Prompt: |
  Add daily random events to Quackito.

  Backend:
  - Add `last_event_date` field to ducks table
  - Event pool (define as JSON/array in code):
    - "Quackito found a shiny pebble!" (+30 XP)
    - "Quackito made a friend at the pond!" (+20 happiness)
    - "Quackito learned a new trick!" (+50 XP)
    - "A butterfly landed on Quackito!" (+10 happiness, +10 energy)
    - "Quackito found some berries!" (+20 hunger)
    - ... (10+ total events)
  - On first visit of the day: pick random event, apply reward, save date
  - New endpoint: GET /api/ducks/:code/daily-event

  Frontend:
  - DailyEvent component: animated toast/modal with event text + reward
  - Auto-trigger on app load if daily event hasn't fired
  - Framer Motion entrance animation

  Files: server/src/routes/, client/src/components/DailyEvent.tsx, useDuck hook
```
**Parallel with:** 5b, 5c | **Depends on:** 5b (needs XP system)

---

## Phase 6 — Customization: Outfits & Shop

### Task 6a — Outfit system (backend + rendering)
```
Agent type: general-purpose
Prompt: |
  Add an outfit/accessory system to Quackito.

  Backend:
  - New table: outfits (id, duck_id, item_id, equipped boolean, unlocked_at timestamp)
  - Item catalog (hardcoded array or config):
    - hat (unlock: level 3), bow (level 5), sunglasses (level 7), scarf (level 10)
  - Endpoints:
    - GET /api/ducks/:code/outfits (list owned + available items with unlock status)
    - POST /api/ducks/:code/outfits/:itemId/equip
    - POST /api/ducks/:code/outfits/:itemId/unequip
  - Auto-unlock items when duck reaches required level

  Frontend rendering:
  - OutfitOverlay component: renders equipped accessories as absolutely-positioned
    PNGs on top of the duck image
  - Each accessory has position offsets per duck stage (baby/duckling/adult)

  Files: server/src/db/ (new table), server/src/routes/outfits.ts,
         client/src/components/OutfitOverlay.tsx, Duck.tsx (integrate overlay)
```
**Depends on:** 5b (needs leveling system for unlock thresholds)

### Task 6b — Shop UI
```
Agent type: general-purpose
Prompt: |
  Add a shop UI to Quackito for browsing and equipping outfits.

  - Shop button in the action bar area (shopping bag icon)
  - Opens a modal/drawer with item grid
  - Each item card shows: icon, name, level requirement, locked/unlocked/equipped state
  - Tap to equip/unequip (toggle)
  - Locked items shown grayed out with "Level X" badge
  - Glassmorphism styling consistent with existing UI
  - Framer Motion enter/exit animations for modal
  - Close button or tap-outside-to-close

  Files: client/src/components/Shop.tsx, ActionButtons.tsx (add shop button),
         client/src/api.ts (outfit API calls)
```
**Depends on:** 6a (needs outfit backend + overlay rendering)

---

## Phase 7 — Duck Life: Animations & Personality

### Task 7a — Idle animations
```
Agent type: general-purpose
Prompt: |
  Add idle animations to the duck in Quackito.

  When the user isn't interacting, the duck should:
  - Waddle side to side (translateX oscillation)
  - Look left/right (subtle scaleX flip)
  - Bob up and down (translateY)
  - Occasionally preen/shake (rotate wiggle)

  Implementation:
  - useIdleAnimation hook: cycles through random idle behaviors every 5-15 seconds
  - Each behavior is a Framer Motion animation variant
  - Idle animations pause during/after action interactions (2s cooldown)
  - Respect duck mood: sleeping duck doesn't waddle, tired duck moves slowly

  Files: client/src/hooks/useIdleAnimation.ts, client/src/components/Duck.tsx
```
**Parallel with:** 7b, 7c

### Task 7b — Enhanced reaction animations
```
Agent type: general-purpose
Prompt: |
  Enhance the duck's reaction animations in Quackito.

  Currently actions just trigger particles. Add multi-step duck body animations:

  Feed reaction:
  - Duck leans down (rotateZ + translateY) → pecking motion (2 quick bobs) →
    happy wiggle (scaleX oscillation) → return to neutral

  Play reaction:
  - Duck jumps up (translateY spring) → spins (rotate 360) →
    lands with bounce → sparkle burst

  Sleep reaction:
  - Duck sways (rotateZ) → head tucks (translateY + scale down slightly) →
    gentle breathing (scale pulse) → zzz particles float up

  Each sequence: 1.5-2.5 seconds via Framer Motion keyframes.
  These should layer ON TOP of existing particle effects, not replace them.

  Files: client/src/components/Duck.tsx (animation variants)
```
**Parallel with:** 7a, 7c

### Task 7c — Duck personality traits
```
Agent type: general-purpose
Prompt: |
  Add personality traits to each duck in Quackito.

  Backend:
  - Add `traits` JSON field to ducks table (array of 1-2 trait strings)
  - Traits: "greedy" (hunger decays 20% faster), "playful" (happiness decays 20% faster),
    "sleepy" (energy decays 20% faster), "shy" (slower idle animations)
  - Assign 1-2 random traits on duck creation
  - Apply trait modifiers to stat decay calculation

  Frontend:
  - PersonalityBadge component: shows trait icons near duck name
  - Traits subtly affect idle animations (shy = less movement, playful = more bouncy)
  - Trait info tooltip on tap

  Files: server/src/db/ (migration), server/src/routes/ (decay modifiers, creation),
         client/src/components/PersonalityBadge.tsx, Duck.tsx
```
**Parallel with:** 7a, 7b

---

## Phase 8 — PWA + Go Live

### Task 8a — PWA setup
```
Agent type: general-purpose
Prompt: |
  Make Quackito a Progressive Web App.

  1. Web App Manifest (client/public/manifest.json):
     - name: "Quackito", short_name: "Quackito"
     - theme_color + background_color matching the app's sky gradient
     - Icons: 192x192 and 512x512 PNG (generate from existing duck art)
     - display: "standalone", orientation: "portrait"

  2. Service Worker (using Vite PWA plugin or workbox):
     - Cache static assets (JS, CSS, images, fonts)
     - Network-first for API calls, cache-first for assets
     - Offline fallback page

  3. Install prompt:
     - "Add to Home Screen" banner on first visit (beforeinstallprompt event)
     - Dismissable, don't show again for 7 days

  Files: client/public/manifest.json, client/vite.config.ts (PWA plugin),
         client/src/hooks/useInstallPrompt.ts
```

### Task 8b — Deploy to production
```
Agent type: Bash
Prompt: |
  Deploy Quackito to production (free tiers).

  Frontend → Vercel:
  - Connect GitHub repo, set build command (cd client && npm run build)
  - Set output directory (client/dist)
  - Add VITE_API_URL env var pointing to backend

  Backend → Railway or Render:
  - Deploy from server/ directory
  - Set env vars: DATABASE_URL, PORT, CORS_ORIGIN (Vercel domain)
  - Provision PostgreSQL addon

  Verify:
  - Frontend loads and connects to backend
  - Duck creation and interaction works end-to-end
  - Test on mobile browser
```
**Depends on:** 8a

---

## Phase 9 — Monitoring & Observability

### Task 9a — Prometheus metrics
```
Agent type: general-purpose
Prompt: |
  Add Prometheus metrics to the Quackito server.

  Install prom-client. Create server/src/metrics.ts:
  - Counter: http_requests_total (method, route, status_code)
  - Counter: duck_interactions_total (action_type: feed/play/sleep)
  - Histogram: http_request_duration_seconds (method, route)
  - Gauge: active_ducks (ducks interacted with in last 24h)

  Add /metrics endpoint (GET, text/plain, Prometheus exposition format).
  Add middleware to instrument all routes.

  Files: server/src/metrics.ts, server/src/index.ts (middleware + /metrics route)
```

### Task 9b — Grafana dashboard
```
Agent type: general-purpose
Prompt: |
  Create a Grafana dashboard for Quackito and add monitoring to the Helm chart.

  Dashboard (JSON model in grafana/dashboards/quackito.json):
  - Panel: Request rate (requests/sec by route)
  - Panel: Error rate (5xx responses)
  - Panel: Response latency (p50, p95, p99)
  - Panel: Duck interactions by type (feed/play/sleep over time)
  - Panel: Active ducks (24h gauge)

  Helm additions:
  - ServiceMonitor template for Prometheus scraping
  - ConfigMap with Grafana dashboard JSON
  - Optional: add kube-prometheus-stack as subchart dependency

  Files: grafana/dashboards/quackito.json, helm/quackito/templates/servicemonitor.yaml
```
**Depends on:** 9a

---

## Dependency Graph (quick reference)

```
Phase 3 (finish) ──→ Phase 4 (core loop) ──→ Phase 5 (progression) ──→ Phase 6 (outfits)
                                                                            │
                     Phase 7 (animations) ←── can start after Phase 5 ──────┘
                     Phase 8 (PWA) ←── can start after Phase 4
                     Phase 9 (monitoring) ←── independent, start anytime
```

Within each phase, tasks labeled "Parallel with" can run simultaneously.
