# Pages Directory

This directory contains **all routes** for the application - both user-facing pages and API endpoints.

## Structure

```
pages/
├── User-facing Pages (HTML)
│   ├── index.astro          → /
│   ├── login/               → /login
│   ├── register/            → /register
│   └── dashboard/           → /dashboard
│
└── API Endpoints (JSON)
    └── api/
        ├── auth/            → /api/auth/*
        │   ├── login.ts     → POST /api/auth/login
        │   ├── register.ts  → POST /api/auth/register
        │   └── logout.ts    → POST /api/auth/logout
        └── data/            → /api/data/*
            ├── get.ts       → GET /api/data/get
            ├── save.ts      → POST /api/data/save
            └── delete.ts    → DELETE /api/data/delete
```

## Why Both Are Here

Astro uses **file-based routing** where the `pages/` directory defines ALL routes:
- `.astro` files → HTML pages
- `.ts` files → API endpoints (return JSON)

This is the same pattern used by Next.js, SvelteKit, and other modern frameworks.

## Convention

The `/api` prefix clearly separates API routes from user-facing pages:
- User pages: `/login`, `/dashboard`, etc.
- API endpoints: `/api/auth/login`, `/api/data/get`, etc.
