---
name: create-feature-branch
description: Create a feature branch from a team branch for development. Use when the user wants to start working on a feature, create a new branch, or begin a new task.
---

# Create Feature Branch

## Workflow

1. Identify the user's team branch (team-1, team-2, team-3, or team-4)
2. Get a short descriptive name for the feature
3. Create and checkout the feature branch

## Commands

```bash
# Ensure you're on the team branch first
git checkout team-X

# Pull latest changes
git pull origin team-X

# Create feature branch with naming convention: team-X/feature-name
git checkout -b team-X/feature-name
```

## Naming Convention

Feature branches follow the pattern: `team-X/short-description`

Examples:
- `team-1/add-search-highlight`
- `team-2/fix-mobile-layout`
- `team-3/add-pagination`
- `team-4/dark-mode-toggle`

## Steps to Execute

1. Ask which team the user is on (if not known)
2. Ask for a brief feature description
3. Run:
   ```bash
   git checkout team-X
   git pull origin team-X
   git checkout -b team-X/feature-description
   ```
4. Confirm the branch was created with `git branch --show-current`

## After Branch Creation

Remind the user:
- Make changes and commit frequently
- Push with: `git push -u origin team-X/feature-name`
- Create a PR to merge back into team branch
