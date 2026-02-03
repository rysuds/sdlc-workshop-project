---
name: cascade-main
description: Force push main branch into all team branches (team-1, team-2, team-3, team-4). Use when the user says "cascade main", "push main to all branches", or "sync all branches to main".
---

# Cascade Main to Team Branches

Force push the current state of `main` to all team branches.

## When to Use

- After updating main and needing all teams to have the latest
- Syncing all team branches to a known good state
- Pushing workshop updates to all teams

## Commands

```bash
# Ensure we're on main and it's up to date
git checkout main
git pull origin main

# Force push main to each team branch
for team in team-1 team-2 team-3 team-4; do
  git push origin main:$team --force
done
```

## Execution

1. **Switch to main and pull latest:**
   ```bash
   git checkout main && git pull origin main
   ```

2. **Force push main to all team branches:**
   ```bash
   for team in team-1 team-2 team-3 team-4; do
     echo "Pushing main to $team..."
     git push origin main:$team --force
   done
   ```

3. **Confirm completion:**
   Report which branches were updated.

## Safety Notes

- This overwrites remote team branches with main's state
- Any work on team branches not merged to main will be lost
- Use for workshop prep/reset, not during active development
