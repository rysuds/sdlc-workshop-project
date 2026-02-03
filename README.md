# SDLC Workshop - Movie Listings App

A hands-on workshop simulating a real software development lifecycle. Four teams compete to improve a movie listings application, each working from their own protected branch with isolated deployments.

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
npm start
```

Then open http://localhost:3000

**Alternative (no npm):**
```bash
python -m http.server 3000
```

---

## Development Workflow

### For Engineers

**Step 1: Create a Feature Branch**

Always branch from your team branch, not from main:

```bash
# Make sure you're on your team branch
git checkout team-1

# Create a feature branch
git checkout -b team-1/add-dark-mode-toggle
```

**Step 2: Make Your Changes**

Edit the files as needed. The project structure is:

```
├── index.html    # Main HTML structure
├── styles.css    # All styling (uses CSS variables)
├── app.js        # JavaScript logic
└── data/
    └── movies.csv  # Movie dataset
```

**Step 3: Commit and Push**

```bash
git add .
git commit -m "Add dark mode toggle button"
git push -u origin team-1/add-dark-mode-toggle
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

## Team Roles

### PM - Product Manager

Your job is to define what gets built.

**Responsibilities:**
- Create tickets in your team's Notion backlog
- Prioritize features and bugs
- Write clear acceptance criteria
- Answer questions from Engineers

**Ticket Template:**
```
Title: [Short descriptive title]
Type: Feature / Bug / Enhancement
Priority: High / Medium / Low
Description: [What needs to be done]
Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
```

### Eng - Engineer

Your job is to implement the tickets.

**Responsibilities:**
- Pull tickets from Notion using Cursor's Notion MCP
- Create feature branches for each ticket
- Write clean, working code
- Create PRs with clear descriptions
- Address review feedback

**Useful Commands:**
```bash
# See what branch you're on
git branch

# See recent changes
git log --oneline -5

# Check status of your changes
git status
```

### QA - Quality Assurance

Your job is to ensure quality.

**Responsibilities:**
- Review pull requests for code quality
- Test changes on Vercel preview URLs
- Verify acceptance criteria are met
- Approve or request changes on PRs
- File bugs in Notion when issues are found

**Review Checklist:**
- [ ] Code is readable and well-organized
- [ ] No obvious bugs or errors
- [ ] Feature works as described in the ticket
- [ ] UI looks good and is responsive
- [ ] No console errors

---

## Notion MCP Setup (for Engineers)

Connect Cursor to Notion to pull tickets directly into your IDE.

### Step 1: Enable Notion MCP in Cursor

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP" or navigate to the MCP section
3. Find "Notion" in the list of available MCPs
4. Click to enable it

### Step 2: Authenticate with Notion

1. Click "Authenticate" or "Connect"
2. Sign in to your Notion account
3. Select the workspace containing your team's backlog
4. Grant Cursor access

### Step 3: Share Your Database

1. Open your team's Notion backlog database
2. Click "Share" in the top right
3. Find "Cursor" or the integration name
4. Click "Invite"

### Step 4: Query Tickets in Cursor

Once connected, you can ask Cursor:

- "What tickets are in my Notion backlog?"
- "Show me high priority bugs from Notion"
- "What's the next ticket I should work on?"

Cursor will fetch the data directly from your Notion workspace.

---

## Project Structure

```
sdlc-workshop-project/
├── index.html          # Main HTML page
├── styles.css          # CSS styling (Cursor brand colors)
├── app.js              # JavaScript - CSV parsing & table rendering
├── server.js           # Express server for local development
├── package.json        # Node.js dependencies
├── data/
│   └── movies.csv      # Movie dataset (~9800 movies)
├── vercel.json         # Vercel deployment config
├── .cursor/
│   └── skills/         # Cursor agent skills
└── README.md           # This file
```

### Key Features of the Base App

- Displays first 50 movies from the dataset
- Search by title or description
- Filter by genre
- Sortable columns (click headers)
- Responsive design
- Movie posters loaded from TMDB

---

## Ideas for Improvements

Here are some features teams might implement:

**Easy:**
- Add pagination (show more movies)
- Add a "favorites" feature (localStorage)
- Improve search highlighting
- Add movie count display

**Medium:**
- Add more filters (year, rating range)
- Implement light/dark mode toggle
- Add movie detail modal on click
- Improve mobile responsiveness

**Hard:**
- Add sorting indicators in headers
- Implement infinite scroll
- Add keyboard navigation
- Create a grid view option

---

## Branch Protection Rules

Team branches are protected. You cannot push directly to them.

**To get code into your team branch:**
1. Create a feature branch
2. Push the feature branch
3. Open a PR to your team branch
4. Get at least 1 approval
5. Merge the PR

This mirrors real-world development workflows.

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

### "The movies aren't loading"

1. Make sure you're running a local server (not opening the file directly)
2. Check the browser console for errors
3. Verify `data/movies.csv` exists

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

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Cursor Documentation](https://docs.cursor.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Notion API Docs](https://developers.notion.com)

---

Good luck, and may the best team win!
