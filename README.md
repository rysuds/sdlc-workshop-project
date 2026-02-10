# SDLC Workshop - LinkedOut

A hands-on workshop simulating a real software development lifecycle. Four teams compete to improve a LinkedIn clone application ("LinkedOut"), each working from their own protected branch with isolated deployments.

## Workshop Overview

Teams are divided into three roles:
- **PM (Product Manager)**: Creates and prioritizes tickets in Notion
- **Eng (Engineer)**: Implements features using Cursor + Notion MCP
- **QA (Quality Assurance)**: Reviews PRs and tests on live preview URLs

Each team has their own:
- Protected branch (`team-1`, `team-2`, `team-3`, `team-4`)
- Live Vercel deployment
- Notion backlog

## Team Deployments

| Team | Branch | Live URL |
|------|--------|----------|
| Team 1 | `team-1` | _[URL will be added after Vercel setup]_ |
| Team 2 | `team-2` | _[URL will be added after Vercel setup]_ |
| Team 3 | `team-3` | _[URL will be added after Vercel setup]_ |
| Team 4 | `team-4` | _[URL will be added after Vercel setup]_ |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sdlc-workshop-project
```

### 2. Switch to Your Team Branch

```bash
# Replace X with your team number (1, 2, 3, or 4)
git checkout team-X
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Then open http://localhost:3000

---

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling (intentionally minimal!)

---

## Project Structure

```
sdlc-workshop-project/
├── index.html              # Vite entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app layout
│   ├── App.css             # Global styles (minimal!)
│   ├── components/
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── LeftSidebar.jsx # Profile & groups sidebar
│   │   ├── Feed.jsx        # Main post feed
│   │   ├── Post.jsx        # Individual post component
│   │   └── RightSidebar.jsx # News, jobs, messaging sidebar
│   └── data/
│       └── mockData.js     # All fake data (users, posts, jobs, etc.)
├── data/
│   └── movies.csv          # Legacy movie dataset (unused)
├── vercel.json             # Vercel deployment config
├── .cursor/
│   └── skills/             # Cursor agent skills
└── README.md               # This file
```

### The Mock Data

All app data lives in `src/data/mockData.js`. It includes:
- **currentUser** - The logged-in user profile (Sarah Chen)
- **users** - 15 other user profiles
- **posts** - 8 feed posts (regular, polls, job changes, shared articles)
- **messages** - 5 conversation previews
- **jobs** - 5 job listings
- **news** - 5 trending news items
- **notifications** - 6 notification items
- **games** - 4 LinkedIn-style games
- **groups, events, savedItems** - Additional user data
- **suggestedConnections** - People you may know
- **promoted** - Ad content

---

## Development Workflow

### For Engineers

**Step 1: Create a Feature Branch**

Always branch from your team branch, not from main:

```bash
# Make sure you're on your team branch
git checkout team-1

# Create a feature branch
git checkout -b team-1/add-dark-mode
```

**Step 2: Make Your Changes**

Edit files in `src/`. The dev server hot-reloads automatically.

**Step 3: Commit and Push**

```bash
git add .
git commit -m "Add dark mode toggle"
git push -u origin team-1/add-dark-mode
```

**Step 4: Create a Pull Request**

1. Go to GitHub
2. Click "Compare & pull request"
3. Set the base branch to your **team branch** (e.g., `team-1`), NOT `main`
4. Add a description of your changes
5. Request review from your QA teammate

**Step 5: Merge After Approval**

Once approved, merge the PR. This triggers an automatic deploy to your team's Vercel URL.

---

## Ideas for Improvements

The base app is intentionally ugly (HTML tables, no styling). Here are ideas teams might implement:

**Easy:**
- Add CSS styling to make it look like real LinkedIn
- Add profile photos/avatars (use placeholder images)
- Make the navbar sticky
- Add hover effects on posts and buttons

**Medium:**
- Implement like/comment functionality (useState)
- Add a "Create Post" feature that adds to the feed
- Build a dark mode toggle
- Make the layout responsive (replace tables with CSS Grid/Flexbox)
- Add a notification badge system

**Hard:**
- Add routing (React Router) for different pages
- Implement a messaging panel
- Add search/filter functionality for the feed
- Build a profile page with the user's data
- Add animations and transitions

---

## Team Roles

### PM - Product Manager

Your job is to define what gets built.

**Responsibilities:**
- Create tickets in your team's Notion backlog
- Prioritize features and bugs
- Write clear acceptance criteria
- Answer questions from Engineers

### Eng - Engineer

Your job is to implement the tickets.

**Responsibilities:**
- Pull tickets from Notion using Cursor's Notion MCP
- Create feature branches for each ticket
- Write clean, working code
- Create PRs with clear descriptions
- Address review feedback

### QA - Quality Assurance

Your job is to ensure quality.

**Responsibilities:**
- Review pull requests for code quality
- Test changes on Vercel preview URLs
- Verify acceptance criteria are met
- Approve or request changes on PRs
- File bugs in Notion when issues are found

---

## Branch Protection Rules

Team branches are protected. You cannot push directly to them.

**To get code into your team branch:**
1. Create a feature branch
2. Push the feature branch
3. Open a PR to your team branch
4. Get at least 1 approval
5. Merge the PR

---

## Troubleshooting

### "I can't push to my team branch"

Team branches are protected. Create a feature branch instead:
```bash
git checkout -b team-X/my-feature
```

### "My changes aren't showing on the live site"

1. Make sure your PR was merged (not just approved)
2. Wait 1-2 minutes for Vercel to deploy
3. Hard refresh the page (Cmd/Ctrl + Shift + R)

### "The dev server won't start"

1. Make sure you ran `npm install`
2. Check you have Node.js v18+: `node --version`
3. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

### "Git says I have conflicts"

```bash
# Get latest changes from your team branch
git checkout team-X
git pull

# Go back to your feature branch and rebase
git checkout team-X/my-feature
git rebase team-X

# Resolve conflicts if any, then force push
git push --force-with-lease
```

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Cursor Documentation](https://docs.cursor.com)
- [Vercel Documentation](https://vercel.com/docs)

---

Good luck, and may the best team win!
