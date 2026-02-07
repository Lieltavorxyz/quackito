# Quackito

A virtual pet duck PWA — feed it, play with it, watch it grow.

## Quick Start

```bash
# Run locally
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

## Docker

```bash
docker-compose up --build
```

Open `http://localhost:3000`

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Tech Stack

- React + TypeScript (Vite)
- Docker + nginx
- GitHub Actions CI/CD
- Kubernetes + ArgoCD (coming soon)

## CI/CD Pipeline

Every PR runs: **Lint → Test → Build Docker Image**

Push to main also triggers: **Deploy**
