---
name: switch-team
description: Switch to a team branch. Use when the user says which team they are on, wants to switch teams, or mentions team 1, team 2, team 3, or team 4.
---

# Switch Team

## Workflow

When user specifies their team (1, 2, 3, or 4):

1. Stash any uncommitted changes (if present)
2. Checkout the team branch
3. Pull latest changes
4. Confirm the switch

## Commands

```bash
# Stash changes if needed
git stash

# Switch to team branch
git checkout team-X

# Pull latest
git pull origin team-X

# Confirm
git branch --show-current
```

## Execution Steps

1. Identify team number from user input (1, 2, 3, or 4)

2. Check for uncommitted changes:
   ```bash
   git status --porcelain
   ```
   If output is not empty, stash first:
   ```bash
   git stash push -m "Auto-stash before team switch"
   ```

3. Switch to team branch:
   ```bash
   git checkout team-X
   ```

4. Pull latest changes:
   ```bash
   git pull origin team-X
   ```

5. Confirm and inform user:
   ```
   Switched to team-X branch.
   You're now ready to start working!
   
   To create a feature branch, just ask me to create one.
   ```

## If Stash Was Used

Remind user:
```
Note: Your uncommitted changes were stashed.
To restore them later: git stash pop
```

## Team Mapping

| User Says | Branch |
|-----------|--------|
| "team 1", "team one", "1" | team-1 |
| "team 2", "team two", "2" | team-2 |
| "team 3", "team three", "3" | team-3 |
| "team 4", "team four", "4" | team-4 |
