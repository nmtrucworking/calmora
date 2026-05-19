# Development — Frontend

Prerequisites
- Node 18+ recommended
- npm

Install

```bash
cd apps/frontend
npm install
```

Run dev server

```bash
cd apps/frontend
npm run dev
```

Build production

```bash
cd apps/frontend
npm run build
```

Preview production build

```bash
cd apps/frontend
npm run preview
```

Lint

```bash
cd apps/frontend
npm run lint
```

Notes
- The project uses TypeScript project references; `tsc -b` is part of the build pipeline.
- The 3D model uses `@react-three/fiber` and can be heavy; use a modern machine or limit DPR in Canvas during development if needed.
