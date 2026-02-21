# Artifact Template

> Claude Code exclusive. Lightweight static pages for sharing.

## MOTTO Digital Context

This project is managed via the MOTTO Digital Executive Assistant. Task tracking, project status, and deliverables live in Notion. Use the MOTTO API (`https://vps.mottodigital.jp` with `X-API-Key: $MOTTO_API_KEY`) to read/update tasks and project status. See the parent repo's CLAUDE.md for full API docs and task handoff protocol.

## What This Is

A minimal template for creating beautiful, shareable static pages — reports, dashboards, presentations, one-pagers, proposals. No backend, no auth, no database. Just great design, exported as static HTML, hosted on the VPS.

## Who I Am

- Business-focused — I care about the output looking professional
- Guide me — I'll describe what I want, you make it look great
- Speed matters — these are quick artifacts, not full apps

## On Conversation Start

1. Ask: **"What page/artifact are we creating?"**
2. Clarify the audience and purpose
3. Build it — no PRD needed for simple artifacts. Use Plan Mode only for multi-page projects.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + React 19 (static export) |
| Styling | Tailwind v4 + shadcn/ui |
| Icons | Lucide React |
| Animations | tw-animate-css |
| Deploy | Static export → VPS (`vps.mottodigital.jp`) |

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Static export to out/
npm run setup        # First-time: clone repo + install deps on VPS
npm run deploy       # Push + build on VPS + deploy (~40s)
```

## Deployment

Builds happen on the VPS (faster, avoids local memory issues). First-time setup:

1. Create GitHub repo: `gh repo create Mottodigitalrice/PROJECT_NAME --public --source=. --push`
2. Set `basePath: "/artifacts/PROJECT_NAME"` in `next.config.ts`
3. Run `npm run setup` (clones repo + installs deps on VPS — one time only)
4. Run `npm run deploy` (push + pull + build + deploy — ~40s)

Live at: `https://vps.mottodigital.jp/artifacts/PROJECT_NAME/`

Add a Caddy route if not already configured:
```
handle_path /artifacts/PROJECT_NAME/* {
    root * /var/www/artifacts/PROJECT_NAME
    try_files {path} {path}.html /index.html
    file_server
}
```

## Page Types (Examples)

- **Report** — Data-rich page with cards, tables, charts, key metrics
- **Dashboard** — Live-looking status overview (static snapshot)
- **Presentation** — Slide-style sections, scroll-based narrative
- **Proposal** — Client-facing document with branding
- **One-pager** — Single scroll, hero + sections + CTA

## Design Principles

- Clean, professional, modern
- Use the full shadcn/ui component library
- Generous whitespace, clear hierarchy
- Dark mode support built in
- Mobile responsive by default
- Print-friendly where appropriate (`@media print` styles)

## Skills & Commands

- `/init` - Build UI with craft and consistency
- `/audit` - Check code against design system
- `/status` - Show current design system state
- `/extract` - Extract patterns from code

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout (fonts, theme, metadata)
    page.tsx         # Main artifact page
    globals.css      # Tailwind v4 + design tokens
  components/
    ui/              # shadcn/ui components
  lib/
    constants.ts     # Project name, description
    utils.ts         # cn() utility
```

## Remember

Speed and beauty. These are shareable artifacts — they should look polished but be quick to create. No over-engineering.
