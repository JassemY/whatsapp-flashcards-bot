# 📖 WhatsApp Flashcards Bot

A production-ready WhatsApp-based flashcards system built with Node.js and Express. Manage your flashcards entirely through WhatsApp interactive buttons and list menus—no text commands required.

## ✨ Features

- 📱 **Button-Only UX**: All interactions via WhatsApp interactive buttons and list menus
- 💾 **Local Storage**: SQLite database for persistent flashcard storage
- 📚 **Multi-Topic Support**: Organize flashcards by topics
- 🎯 **Quiz Mode**: Interactive quizzes with immediate feedback
- 📊 **Progress Tracking**: Track correct/wrong answers for each flashcard
- 🚀 **Production-Ready**: Clean, modular architecture ready for deployment
- ⚡ **Zero AI**: Fully deterministic, no AI/ML dependencies

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **API**: WhatsApp Cloud API
- **Environment**: dotenv

## 📂 Project Structure

```
whatsapp-flashcards-bot/
├── server.js                    # Entry point
├── package.json
├── .env.example                 # Environment variables template
├── .gitignore
├── README.md
├── GITHUB_WORKFLOW.md           # Git workflow guide
└── src/
    ├── routes/
    │   ├── index.js            # Main router
    │   └── webhook.js          # WhatsApp webhook endpoints
    ├── controllers/
    │   ├── messageController.js # Message routing & dispatch
    │   ├── quizController.js    # Quiz flow logic
    │   ├── flashcardController.js # Add/edit/delete flashcards
    │   └── browseController.js   # Browse & view flashcards
    ├── services/
    │   ├── flashcardService.js  # Flashcard CRUD & database queries
    │   ├── quizService.js       # Quiz business logic
    │   └── sessionService.js    # User session tracking
    ├── ui/
    │   └── index.js             # WhatsApp interactive message builders
    ├── data/
    │   └── db.js                # SQLite connection & setup
    └── utils/
        ├── whatsappAPI.js       # WhatsApp API wrapper
        ├── payload.js           # Payload encoding/decoding
        └── idGenerator.js       # Unique ID generation
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 14+ installed
- WhatsApp Business Account with Cloud API access
- Meta Sandbox for testing (or production setup)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whatsapp-flashcards-bot.git
cd whatsapp-flashcards-bot

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Configuration

See [ENV SETUP REQUIRED](#env-setup-required) section below.

### 4. Run Locally

```bash
npm start
```

The server will start on `http://localhost:3000`.

### 5. Expose to Internet (for Webhook)

For local testing, use a tunneling service:

```bash
# Using ngrok (install from https://ngrok.com)
ngrok http 3000
```

Use the generated HTTPS URL as your webhook URL in Meta dashboard.

---

## 🔑 ENV SETUP REQUIRED

### Getting Your Credentials

#### 1. **WHATSAPP_TOKEN**
   - **What it is**: Your WhatsApp Cloud API access token
   - **Where to get it**:
     1. Go to [Meta Developers Console](https://developers.facebook.com/)
     2. Navigate to **Settings > User Tokens**
     3. Generate or copy your existing token
     4. Copy the token value
   - **What breaks if missing**: Cannot send messages; API calls will fail with 401 Unauthorized

#### 2. **WHATSAPP_PHONE_NUMBER_ID**
   - **What it is**: Your WhatsApp Business Phone Number ID
   - **Where to get it**:
     1. Go to **Meta Developers Console**
     2. Navigate to **WhatsApp > Getting Started**
     3. Find your Phone Number ID in the dashboard
     4. Copy the numeric ID
   - **What breaks if missing**: Cannot send messages; API doesn't know which phone number to use

#### 3. **VERIFY_TOKEN**
   - **What it is**: A custom token you create to verify webhook authenticity
   - **How to set it**:
     1. Create any random string (e.g., `my_secure_webhook_token_12345`)
     2. Set it in your `.env` file
     3. Also set the same value in Meta dashboard > **Configuration**
   - **What breaks if missing**: Webhook verification will fail; WhatsApp cannot confirm your server is legitimate

#### 4. **PORT**
   - **What it is**: Server port
   - **Default**: 3000
   - **What breaks if missing**: Server won't start; already in use errors

#### 5. **DATABASE_PATH** (Optional)
   - **What it is**: Path to SQLite database file
   - **Default**: `flashcards.db`
   - **What breaks if missing**: Database is created in wrong location

### .env.example

```bash
# WhatsApp Cloud API
WHATSAPP_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
VERIFY_TOKEN=your_custom_webhook_token_here

# Server Configuration
PORT=3000

# Database Configuration (optional)
DATABASE_PATH=flashcards.db

# Environment
NODE_ENV=development
```

### Testing Your Setup

```bash
# Start the server
npm start

# In another terminal, test the health endpoint
curl http://localhost:3000/

# Response should be:
# {"status":"ok","message":"WhatsApp Flashcards Bot is running","version":"1.0.0"}
```

---

## 📱 User Flows

### Flow 1: Add Flashcard

```
User sends any message
       ↓
Bot shows Main Menu (3 buttons)
       ↓
User taps "➕ Add Flashcard"
       ↓
Bot shows Topic List (WhatsApp list menu)
       ↓
User selects topic (e.g., "Biology")
       ↓
Bot prompts: "Send me the question"
       ↓
User sends text: "What is photosynthesis?"
       ↓
Bot prompts: "Send me the answer"
       ↓
User sends text: "Process of converting light to energy..."
       ↓
Bot confirms: "✅ Flashcard Added!"
       ↓
Bot shows Main Menu again
```

### Flow 2: Start Quiz

```
User sends any message
       ↓
Bot shows Main Menu (3 buttons)
       ↓
User taps "📝 Start Quiz"
       ↓
Bot shows Topic List
       ↓
User selects topic
       ↓
Bot shows first question with 3 buttons:
  - 👁️ Show Answer
  - ⏭️ Next
  - ❌ End Quiz
       ↓
User taps "👁️ Show Answer"
       ↓
Bot shows question + answer with 2 buttons:
  - ✓ Got it!
  - ❌ End Quiz
       ↓
User taps "✓ Got it!" (moves to next card index)
       ↓
Bot shows next question
       ↓
       (repeat or End Quiz)
       ↓
Bot shows summary:
  "📊 Quiz Complete! 5/7 Correct (71%)"
```

### Flow 3: Browse Topics

```
User sends any message
       ↓
Bot shows Main Menu
       ↓
User taps "📚 Browse Topics"
       ↓
Bot shows Topic List
       ↓
User selects topic
       ↓
Bot shows first card with details + 2 buttons:
  - 🗑️ Delete
  - 🏠 Back
       ↓
User can delete or go back
```

---

## 🔌 API Endpoints

### GET /webhook
- **Purpose**: Webhook verification (required by WhatsApp)
- **Parameters**:
  - `hub.mode`: "subscribe"
  - `hub.verify_token`: Your VERIFY_TOKEN
  - `hub.challenge`: Echo this back if verified
- **Response**: 200 OK with challenge
- **Error**: 403 if token doesn't match

### POST /webhook
- **Purpose**: Receive messages from WhatsApp
- **Body**: WhatsApp message payload
- **Response**: 200 OK (acknowledges receipt)
- **Processing**: Extracts button clicks, list selections, and text messages

---

## 📊 Database Schema

### flashcards table

```sql
CREATE TABLE flashcards (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,                    -- WhatsApp phone number
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  correctCount INTEGER DEFAULT 0,         -- Times answered correctly
  wrongCount INTEGER DEFAULT 0,           -- Times answered wrong
  deleted INTEGER DEFAULT 0,              -- Soft delete flag
  UNIQUE(userId, topic, question)
);

-- Indexes for fast queries
CREATE INDEX idx_userId_topic ON flashcards(userId, topic);
CREATE INDEX idx_userId ON flashcards(userId);
CREATE INDEX idx_deleted ON flashcards(deleted);
```

---

## 🎯 Key Design Decisions

1. **Button-Only UX**: No text commands. All navigation is via WhatsApp interactive buttons and lists.
2. **Stateless State**: User context encoded in button payloads + in-memory session tracking (no persistent session storage needed).
3. **SQLite**: Local database; easy to backup, inspect, and deploy.
4. **Soft Deletes**: Deleted cards marked as deleted instead of removed (preserves data integrity).
5. **Unique Constraint**: Prevents duplicate flashcards in same topic for same user.
6. **Phone Number as User ID**: WhatsApp provides this; no separate authentication needed.

---

## 🐛 Troubleshooting

### "Missing required environment variables"
- **Solution**: Make sure `.env` file exists and has all required variables
- **Check**: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `VERIFY_TOKEN`

### "Webhook verification failed"
- **Solution**: Verify token in `.env` matches the token in Meta dashboard
- **Check**:
  ```bash
  echo $VERIFY_TOKEN    # Should match dashboard
  ```

### "Cannot send messages"
- **Solution**: Check WHATSAPP_TOKEN and PHONE_NUMBER_ID are correct
- **Test**:
  ```bash
  # Check if credentials are loaded
  node -e "require('dotenv').config(); console.log(process.env.WHATSAPP_TOKEN);"
  ```

### "Database locked error"
- **Solution**: Multiple processes accessing database; ensure only one server running
- **Fix**: Kill conflicting processes
  ```bash
  # Find process on port 3000
  lsof -i :3000
  kill -9 [PID]
  ```

---

## 📚 Development Guide

### Adding a New Feature

1. **Define the flow** in a controller (e.g., `src/controllers/newFeature.js`)
2. **Add UI messages** to `src/ui/index.js`
3. **Create service logic** in `src/services/`
4. **Add payload routing** in `src/controllers/messageController.js`
5. **Test** end-to-end

### Code Style

- **Async/Await**: Always use async/await (no callbacks)
- **Error Handling**: Wrap service calls in try/catch
- **Logging**: Use `console.log()` with emojis for clarity
- **Comments**: Document complex logic and payload structures

### Testing

Recommended: Use Meta Sandbox or WhatsApp Business test account

1. Send test message to your bot number
2. Verify responses in WhatsApp
3. Check SQLite database directly:
   ```bash
   sqlite3 flashcards.db "SELECT * FROM flashcards;"
   ```

---

## 🚢 Deployment

### Option 1: Railway (Recommended, Free Tier)

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Deploy
5. Get public URL from Railway
6. Set webhook URL in Meta dashboard

### Option 2: Render

Similar to Railway; sign up at [render.com](https://render.com)

### Option 3: Local Machine

1. Run `npm start`
2. Use ngrok for webhook exposure
3. Keep server running (use `screen` or `tmux`)

### Option 4: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t whatsapp-flashcards-bot .
docker run -p 3000:3000 --env-file .env whatsapp-flashcards-bot
```

---

## 📖 GitHub Setup & Workflow

See [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for detailed instructions on:
- Initial GitHub cloning
- Development workflow (branches, commits, pushes)
- Best practices for commit messages
- Pull request guidelines

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

To add features:
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push and open a PR

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## ❓ FAQ

**Q: Can multiple users use this?**
A: Yes! Each user is identified by their WhatsApp phone number. Separate flashcard databases per user.

**Q: Is there a web interface?**
A: No, intentionally WhatsApp-only. Keep it simple!

**Q: Can I export flashcards?**
A: You can query the SQLite database directly:
```bash
sqlite3 flashcards.db ".mode csv" ".output export.csv" "SELECT topic, question, answer FROM flashcards WHERE userId='1234567890';"
```

**Q: What's the message limit?**
A: WhatsApp buttons support 256 characters per ID. This bot uses `|`-separated payloads, tested up to ~100 char questions.

**Q: Can I add images to flashcards?**
A: Currently no, but this could be extended. Would require media handling in WhatsApp API.

---

## 📧 Support

For issues or questions, check the [Troubleshooting](#-troubleshooting) section or review server logs:

```bash
# Start with verbose logging
NODE_ENV=development npm start
```