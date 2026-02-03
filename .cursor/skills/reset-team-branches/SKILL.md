---
name: reset-team-branches
description: "DANGEROUS: Force reset all team branches. ONLY use this skill when the user EXPLICITLY says 'reset branches' or 'reset team branches'. NEVER use for updating branches, syncing branches, or any other operation. This skill destroys branch history."
---

# Reset Team Branches

## Purpose

Reset all team branches to match the current branch (typically `main` for demo start state) and force push to origin. This is useful for:
- Resetting workshop state between sessions
- Starting fresh after demo
- Restoring all teams to a known good state

## Workflow

1. Identify the current branch (source branch)
2. For each team branch (team-1, team-2, team-3, team-4):
   - Reset the branch to match current branch
   - Force push to origin
3. Confirm completion

## Commands

```bash
# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)

# For each team branch
for team in team-1 team-2 team-3 team-4; do
  git checkout $team
  git reset --hard $CURRENT_BRANCH
  git push origin $team --force
done

# Return to original branch
git checkout $CURRENT_BRANCH
```

## Execution Steps

1. **Identify source branch:**
   ```bash
   CURRENT_BRANCH=$(git branch --show-current)
   echo "Resetting team branches to: $CURRENT_BRANCH"
   ```

2. **Reset each team branch:**
   ```bash
   for team in team-1 team-2 team-3 team-4; do
     echo "Resetting $team..."
     git checkout $team
     git reset --hard $CURRENT_BRANCH
     git push origin $team --force
   done
   ```

3. **Return to original branch:**
   ```bash
   git checkout $CURRENT_BRANCH
   ```

4. **Confirm completion:**
   ```
   All team branches have been reset to $CURRENT_BRANCH and pushed to origin.
   ```

## Safety Notes

- This operation uses `--force` push and will overwrite remote team branches
- Any uncommitted work on team branches will be lost
- This is intended for workshop reset scenarios, not during active development
- Consider warning users if this is run during an active workshop session

## Error Handling

If a team branch doesn't exist locally:
```bash
# Create it first
git checkout -b $team origin/$team 2>/dev/null || git checkout -b $team $CURRENT_BRANCH
```

If push fails due to branch protection:
- Team branches may be protected on GitHub
- You may need to temporarily disable branch protection rules
- Or use a different approach (create PRs to reset each branch)

## Example Output

```
Resetting team branches to: main
Resetting team-1...
HEAD is now at 9cfcf5c Add switch-team skill for easy team branch switching
Resetting team-2...
HEAD is now at 9cfcf5c Add switch-team skill for easy team branch switching
Resetting team-3...
HEAD is now at 9cfcf5c Add switch-team skill for easy team branch switching
Resetting team-4...
HEAD is now at 9cfcf5c Add switch-team skill for easy team branch switching
Switched back to branch 'main'
All team branches have been reset to main and pushed to origin.
```
