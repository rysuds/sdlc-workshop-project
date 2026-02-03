---
name: create-pr
description: Create a pull request from a feature branch to a team branch. Use when the user wants to create a PR, submit changes for review, open a pull request, or merge their work.
---

# Create Pull Request

## Prerequisites

- Changes committed to a feature branch
- Feature branch pushed to remote
- GitHub CLI (`gh`) installed and authenticated

## Workflow

1. Ensure all changes are committed
2. Push the feature branch to remote
3. Create PR targeting the team branch (not main)
4. Return the PR URL to the user

## Commands

```bash
# Check current branch and status
git branch --show-current
git status

# Push feature branch (first time)
git push -u origin HEAD

# Create PR to team branch
gh pr create --base team-X --title "Title" --body "Description"
```

## Steps to Execute

1. Check current branch name to extract team number
   ```bash
   git branch --show-current
   # Expected format: team-X/feature-name
   ```

2. Check for uncommitted changes
   ```bash
   git status
   ```
   If uncommitted changes exist, ask user to commit first.

3. Push the branch
   ```bash
   git push -u origin HEAD
   ```

4. Create the PR targeting the correct team branch
   ```bash
   gh pr create --base team-X --title "Feature title" --body "Description of changes"
   ```

5. **IMPORTANT**: Always output the PR URL to the user. The `gh pr create` command outputs the URL. Format it clearly:
   
   ```
   PR created successfully!
   
   PR URL: https://github.com/org/repo/pull/123
   ```

## Determining Base Branch

Extract team number from current branch:
- `team-1/add-search` → base branch is `team-1`
- `team-2/fix-bug` → base branch is `team-2`

**Never target `main`** - always target the team branch.

## PR Title and Body

If not provided by user, generate from:
- Title: Branch name converted to readable format
- Body: Summary of commits on the branch

```bash
# Get commit messages for PR body
git log team-X..HEAD --oneline
```

## Error Handling

**"gh: command not found"**
```bash
# Install GitHub CLI
brew install gh  # macOS
# Then authenticate
gh auth login
```

**"pull request already exists"**
```bash
# Get existing PR URL
gh pr view --web
```

## Always Return PR URL

After successful PR creation, clearly display:
```
Pull Request Created!

URL: [the PR URL from gh output]

Next steps:
- Share this link with your QA teammate for review
- Once approved, merge the PR to trigger deployment
```
