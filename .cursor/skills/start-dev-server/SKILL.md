---
name: start-dev-server
description: Start the development server for the LinkedOut app. Use when the user wants to run, start, or launch the app locally, or asks how to preview the project.
---

# Start Development Server

## Quick Start

Run the development server:

```bash
npm install   # First time only
npm run dev   # Starts Vite dev server on http://localhost:3000
```

## Prerequisites

- Node.js installed (v18 or higher)
- Run `npm install` once to install React, Vite, and dependencies

## Verification

After starting, verify:
1. Terminal shows "Local: http://localhost:3000/"
2. Open http://localhost:3000 in browser
3. LinkedOut page loads with feed posts

## Troubleshooting

**Port already in use:**
```bash
# Vite will auto-pick the next available port
# Or kill the process using port 3000:
kill $(lsof -ti:3000)
npm run dev
```

**Build for production:**
```bash
npm run build    # Creates dist/ folder
npm run preview  # Preview the production build
```
