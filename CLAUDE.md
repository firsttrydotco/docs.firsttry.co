# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation site for First Try, built with **Mintlify**. The site is deployed via Mintlify's hosted platform.

**Related project:** `~/firsttry.co` - The main website (FastHTML)

## ⚠️ SECURITY - OPEN SOURCE REPOSITORY

**This repository is PUBLIC/OPEN SOURCE.** Be careful with what you commit.

### What's safe to have in the repo:
- **PostHog public API key** (`phc_...`) - This is a **write-only** project key designed to be exposed in frontend code. It can only send events, not read data or perform admin operations. All frontend analytics tools work this way (GA4 measurement ID, Mixpanel token, etc.)

### What should NEVER be committed:
- PostHog **Personal API Key** (starts with `phx_...`) - This has admin access
- Any server-side secrets or credentials
- Private API keys from any service
- `.env` files with sensitive data

## Architecture

### Tech Stack
- **Platform:** Mintlify (hosted documentation platform)
- **Config:** `docs.json` (Mintlify schema)
- **Content:** MDX files (Markdown with JSX components)
- **Deployment:** Automatic via Mintlify (push to git triggers deploy)

### Project Structure

```
docs.firsttry.co/
├── docs.json                 # Main Mintlify configuration (theme, nav, integrations)
├── tracking.js               # Custom PostHog events (auto-included by Mintlify)
├── introduction.mdx          # Homepage
├── favicon.svg               # Site favicon
├── logo/                     # Logo assets (dark/light variants)
│   ├── dark.png
│   └── light.png
├── getting-started/          # Documentation content
│   └── user-acquisition/
│       └── meta-ads/
│           └── first-campaigns.mdx
└── CLAUDE.md                 # This file
```

### Key Configuration (docs.json)

- **Theme:** `mint`
- **Colors:** Primary `#22BB9A` (teal green)
- **Integrations:** PostHog EU instance
- **Feedback:** Thumbs rating enabled
- **Navigation:** Configured in `navigation.groups`

## Analytics Setup

### PostHog Configuration

PostHog est configuré dans `docs.json` via l'intégration native Mintlify :

```json
"integrations": {
  "posthog": {
    "apiKey": "phc_pxd53viYzYm5cBw7gEjhVO6ZamIGyaXQ7aM0gwzwUqs",
    "apiHost": "https://eu.i.posthog.com",
    "sessionRecording": true
  }
}
```

**Configuration:**
- **Instance:** EU (GDPR compliant)
- **Même projet** que firsttry.co (projet ID: 93824)
- **Session Recording:** Activé (nécessite d'autoriser le domaine dans PostHog)

### Ce que Mintlify track automatiquement :
- Pageviews (`$pageview`)
- Clics de navigation
- Recherches
- Feedback ratings (thumbs up/down)
- Temps sur page
- Session recordings (si activé)

### Events custom (tracking.js) :
- `Scroll 75%` - Utilisateur a scrollé 75% de la page
- `Time on Page > 2 min` - Utilisateur resté plus de 2 minutes
- `Clic CTA` - Clic sur bouton CTA (topbar, mailto, calendly, etc.)

### Dashboard PostHog
- **Dashboard dédié:** https://eu.i.posthog.com/project/93824/dashboard/502499
- **Action créée:** "Docs Pageview" (filtre `$current_url contains docs.firsttry.co`)

### Pour voir uniquement le trafic docs :
Dans n'importe quel insight PostHog, ajouter le filtre :
- `$current_url` → `contains` → `docs.firsttry.co`

## Development Commands

### Local Development
```bash
mintlify dev
```
Runs the development server with hot reload.

### Preview Changes
Push to a branch and Mintlify creates preview deployments automatically.

### Deploy
Push to main branch - Mintlify deploys automatically.

## Content Guidelines

### Adding New Pages
1. Create `.mdx` file in appropriate directory
2. Add the page path to `docs.json` navigation

### Mintlify Components
Use Mintlify's built-in components:
- `<Card>`, `<CardGroup>` - Content cards
- `<Tabs>`, `<Tab>` - Tabbed content
- `<Accordion>` - Collapsible sections
- `<CodeGroup>` - Multi-language code blocks

## Important Notes

- **Language:** Content is primarily in French (project owner preference)
- **No build process:** Mintlify handles everything
- **No package.json:** Pure content repository
- Configuration changes in `docs.json` trigger full rebuild
