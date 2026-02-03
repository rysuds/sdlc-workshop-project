---
name: start-dev-server
description: Start the development server for the movie listings app. Use when the user wants to run, start, or launch the app locally, or asks how to preview the project.
---

# Start Development Server

## Quick Start

Run the development server:

```bash
npm install   # First time only
npm start     # Starts server on http://localhost:3000
```

## Prerequisites

- Node.js installed (v14 or higher)
- Run `npm install` once to install Express

## Verification

After starting, verify:
1. Terminal shows "Server running at http://localhost:3000"
2. Open http://localhost:3000 in browser
3. Movie table loads with data

## Troubleshooting

**Port already in use:**
```bash
# Use a different port
PORT=3001 npm start
```

**Movies not loading:**
- Check browser console for errors
- Verify `data/movies.csv` exists

## Alternative (No Install)

If npm is unavailable:
```bash
python -m http.server 3000
```
Then open http://localhost:3000
