# Architecture

## System Overview

```
┌─────────────────────────────────────────────┐
│              Static HTML/CSS/JS              │
│  ┌───────────────────────────────────────┐  │
│  │           Next.js (Static Export)      │  │
│  │  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  App Router  │  │  Components  │   │  │
│  │  │  (pages)     │  │  (shadcn/ui) │   │  │
│  │  └──────────────┘  └──────────────┘   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    │
              Static Export
                    │
              ┌─────▼─────┐
              │  VPS/CDN  │
              │  (Caddy)  │
              └───────────┘
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Main page
│   └── globals.css         # Tailwind v4 + design tokens
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── shared/             # Reusable project components
└── lib/
    ├── constants.ts        # App name, description
    └── utils.ts            # cn() utility
```

## Key Patterns

### Static Export
- `next.config.ts` sets `output: "export"`
- `npm run build` produces `out/` directory with static HTML
- No server-side rendering, no API routes, no middleware
- All pages are pre-rendered at build time

### Components
- All components are client or server — no data fetching
- Use shadcn/ui for consistent, professional UI
- Compose pages from Card, Table, Badge, Tabs, etc.

### Adding Pages
Create new routes by adding folders in `src/app/`:
```
src/app/
├── page.tsx              # / (main page)
├── details/page.tsx      # /details
└── summary/page.tsx      # /summary
```

## No Backend

This template has NO:
- Authentication
- Database
- API routes
- Server-side rendering
- Middleware

It's pure static HTML. If you need any of the above, use the MVP or Demo template instead.
