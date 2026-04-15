# 📖 GitHub Workflow Guide

This guide explains how to set up this project on GitHub and work with it using Git.

---

## 🚀 Initial Setup (First Time)

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click **New Repository** (top-right corner)
3. Fill in:
   - **Repository name**: `whatsapp-flashcards-bot` (or your preferred name)
   - **Description**: "A WhatsApp-based flashcards system"
   - **Public** or **Private** (your choice)
   - **Add .gitignore**: Node (optional, we already have one)
4. Click **Create Repository**
5. You'll get a URL like: `https://github.com/yourusername/whatsapp-flashcards-bot.git`

### Step 2: Connect Local Repository to GitHub

In your terminal, navigate to the project directory:

```bash
cd /Users/jasemalyaqoub/Documents/projects/whatsapp-flashcards-bot
```

Initialize Git (if not already done):

```bash
git init
```

Add the GitHub remote:

```bash
git remote add origin https://github.com/yourusername/whatsapp-flashcards-bot.git
```

Verify the remote is set:

```bash
git remote -v
# Should output:
# origin  https://github.com/yourusername/whatsapp-flashcards-bot.git (fetch)
# origin  https://github.com/yourusername/whatsapp-flashcards-bot.git (push)
```

### Step 3: Initial Commit and Push

Add all files to staging:

```bash
git add .
```

Create an initial commit:

```bash
git commit -m "Initial commit: WhatsApp Flashcards Bot with button-based UX"
```

Push to GitHub:

```bash
git branch -M main
git push -u origin main
```

The `-u` flag sets `origin main` as the default upstream branch.

---

## 📝 Development Workflow

### Regular Development Cycle

#### 1. Check Status

```bash
git status
```

This shows:
- **Untracked files**: New files not yet added to Git
- **Modified files**: Changes to existing files
- **Staged files**: Changes ready to commit

#### 2. Stage Changes

Stage specific files:

```bash
git add src/services/newService.js
```

Or stage all changes:

```bash
git add .
```

View what's staged:

```bash
git diff --cached
```

#### 3. Commit Changes

```bash
git commit -m "Add new feature description"
```

#### 4. Push to GitHub

```bash
git push origin main
```

Or if you set upstream in step 3:

```bash
git push
```

---

## 🌿 Using Feature Branches (Recommended)

For larger features, use feature branches:

### Create a Feature Branch

```bash
git checkout -b feature/add-voice-support
```

### Make Changes and Commit

```bash
git add .
git commit -m "Implement voice note support for flashcards"
```

### Push Branch to GitHub

```bash
git push -u origin feature/add-voice-support
```

### Create a Pull Request

1. Go to GitHub repository
2. Click **Pull Requests** tab
3. Click **New Pull Request**
4. Base: `main`, Compare: `feature/add-voice-support`
5. Add title and description
6. Click **Create Pull Request**

### Merge to Main

After review, click **Merge Pull Request** or merge from terminal:

```bash
git checkout main
git merge feature/add-voice-support
git push origin main
```

### Delete Branch

```bash
git branch -d feature/add-voice-support
git push origin --delete feature/add-voice-support
```

---

## 💬 Commit Message Best Practices

### Good Commit Messages

✅ **Described**: Explain WHAT and WHY, not HOW

```bash
git commit -m "Add quiz progress tracking

- Track correct/wrong answers per card
- Store stats in database
- Display accuracy percentage after quiz
- Helps users identify weak areas"
```

✅ **Specific**: Feature-level, atomic changes

```bash
git commit -m "Implement topic list selector for quiz start"
```

✅ **Imperative**: Use action verbs

```bash
git commit -m "Refactor WhatsApp API wrapper for reusability"
```

### Bad Commit Messages

❌ **Vague**:

```bash
git commit -m "Fix stuff"          # What stuff?
git commit -m "Updates"            # What updates?
git commit -m "WIP"                # Incomplete!
```

❌ **Running Multiple Features**:

```bash
git commit -m "Add quiz, delete cards, fix bugs, update UI"  # Way too much!
```

❌ **Passive**:

```bash
git commit -m "Session service was modified"
```

### Commit Message Template

```
[Type] Brief description (50 chars or less)

Longer explanation (if needed):
- What did you change?
- Why did you change it?
- What will this enable?

Type: feat, fix, refactor, docs, test, etc.
```

---

## 🔄 Syncing with GitHub

### Pull Latest Changes

If you work on different machines or have collaborators:

```bash
git pull origin main
```

### Check What's Different

```bash
git diff origin/main
```

### See Commit History

```bash
git log --oneline -10
```

Shows last 10 commits:

```
ab12cd3 (HEAD -> main, origin/main) Add quiz progress tracking
ef56gh7 Implement topic list selector
ij78kl9 Create SQLite schema
...
```

---

## 🚨 Common Issues & Fixes

### Issue: "Permission denied (publickey)"

**Cause**: GitHub doesn't recognize your SSH key

**Fix**: Use HTTPS with GitHub login:

```bash
git remote set-url origin https://github.com/yourusername/whatsapp-flashcards-bot.git
```

Or set up SSH keys:
```bash
ssh-keygen -t ed25519
# Follow prompts, add public key to GitHub Settings > SSH Keys
```

### Issue: "Detached HEAD"

**Cause**: You checked out a commit instead of a branch

**Fix**: Go back to main:

```bash
git checkout main
```

### Issue: "Changes not staged for commit"

**Cause**: Files were modified but not added to staging

**Fix**: Stage before committing:

```bash
git add .
git commit -m "Your message"
```

### Issue: "Merge conflict"

**Cause**: Same lines changed in different branches

**Solution**:
1. Open conflicting file
2. Look for `<<<<<<`, `======`, `>>>>>>>` markers
3. Manually choose which version to keep
4. Delete markers
5. Stage and commit:

```bash
git add .
git commit -m "Resolve merge conflict"
```

---

## 📂 .gitignore Explained

Your `.gitignore` file prevents sensitive files from being pushed:

```
# Don't commit:
.env                    # Environment variables with secrets
*.db                    # SQLite database (local data)
node_modules/           # Dependencies (too large)
.DS_Store               # macOS system files
logs/                   # Log files
```

Check what's ignored:

```bash
git status --ignored
```

---

## 🔐 Security Best Practices

### 1. Never Commit .env

Ensure `.env` is in `.gitignore`:

```bash
cat .gitignore | grep .env  # Should show ".env"
```

### 2. If You Accidentally Committed .env

```bash
# Remove from history (entire file)
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from repository"
git push

# Important: Anyone with access has potentially seen secrets
# Rotate your WHATSAPP_TOKEN after this!
```

### 3. Verify Nothing Sensitive Is in History

```bash
git log -p | grep -i "WHATSAPP_TOKEN"  # Should return nothing
```

---

## 📊 Useful Git Commands Reference

```bash
# View status
git status

# Add files
git add .                        # Add all changes
git add src/file.js              # Add specific file

# Commit
git commit -m "Message"          # With message inline
git commit                       # Opens editor for longer message

# Push/Pull
git push                         # Push commits
git pull                         # Fetch and merge remote changes

# Branches
git branch                       # List local branches
git branch -a                    # List all branches (local + remote)
git checkout -b feature/name     # Create and switch to new branch
git checkout main                # Switch to existing branch

# History
git log                          # Full commit history
git log --oneline                # Compact history
git log -n 5                     # Last 5 commits
git diff                         # Show unstaged changes
git diff --cached                # Show staged changes

# Undo changes
git restore file.js              # Discard local changes
git reset HEAD file.js           # Unstage file
git revert abc123                # Create new commit undoing changes

# Remote
git remote -v                    # List remotes
git remote add origin URL        # Add remote
git push -u origin branch        # Push new branch with tracking
```

---

## 🎯 Typical Day Workflow

### Morning: Start Working

```bash
# Update to latest
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Make changes...
```

### During Work: Commit Frequently

```bash
# Every hour or every completed task:
git add .
git commit -m "Specific feature description"
```

### Before Leaving: Push Your Work

```bash
# Push commits to backup on GitHub
git push origin feature/my-feature
```

### When Done: Merge to Main

```bash
# Switch to main
git checkout main

# Merge feature
git merge feature/my-feature

# Push
git push origin main

# Cleanup
git branch -d feature/my-feature
```

---

## 📚 Learning Resources

- **Git Basics**: https://git-scm.com/book/en/v2
- **GitHub Guide**: https://guides.github.com/
- **Interactive Git**: https://learngitbranching.js.org/

---

## ✅ Checklist Before Each Push

[ ] All changes are staged: `git status`
[ ] Commit message is descriptive: `git log --oneline -1`
[ ] No secrets in changes: `git diff --cached | grep -i secret`
[ ] `.env` is in `.gitignore`
[ ] Feature is tested locally
[ ] No conflicts with main: `git pull origin main`

---

## 🚀 Ready to Push!

Once you've verified the checklist:

```bash
git push origin main
```

Your changes are now backed up on GitHub! 🎉
