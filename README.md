# BELVO — Premium Agency Website

A luxury creative agency homepage built with Vite + React + TypeScript + Tailwind CSS v4.

## Quick Start

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript check without building |

## Requirements

- **Node.js 18+**
- **npm 9+** (or pnpm / yarn)

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Vite | ^6 | Build tool & dev server |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Utility-first styles |
| Framer Motion | ^11 | Animations |
| Wouter | ^3 | Client-side routing |
| Radix UI | latest | Accessible UI primitives |
| Lucide React | latest | Icons |
| TanStack Query | ^5 | Async state management |

## Project Structure

```
belvo/
├── public/
│   ├── belvo-logo-transparent.png   # BELVO logo with transparent background
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Navbar.tsx               # Sticky glassmorphism navigation
│   │   └── ui/                      # shadcn/ui component library
│   ├── pages/
│   │   ├── Home.tsx                 # Hero with animated aurora background
│   │   ├── ComingSoon.tsx           # Placeholder for future pages
│   │   └── not-found.tsx
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx
│   └── index.css                    # Global styles + Tailwind config
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Pages (routing ready)

| Route | Status |
|---|---|
| `/` | Home — fully built |
| `/about` | Coming Soon placeholder |
| `/services` | Coming Soon placeholder |
| `/works` | Coming Soon placeholder |
| `/careers` | Coming Soon placeholder |
| `/blogs` | Coming Soon placeholder |
| `/contact` | Coming Soon placeholder |
