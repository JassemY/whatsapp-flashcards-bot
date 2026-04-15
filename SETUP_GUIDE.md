# 🧪 WhatsApp Flashcards Bot — Complete Setup & Testing Guide

## 📋 Pre-Flight Checklist

Before running this bot, ensure:

- ✅ Node.js 14+ installed: `node --version`
- ✅ npm installed: `npm --version`
- ✅ Project cloned/downloaded
- ✅ Dependencies installed: `npm install`
- ✅ `.env` file created with credentials
- ✅ Meta WhatsApp Business Account set up
- ✅ Webhook exposing tool ready (ngrok, etc.)

---

## 🔑 Step 1: Get Your WhatsApp Credentials

Follow these steps to get the 3 required credentials.

### 1.1 WHATSAPP_TOKEN

**Where to get it:**

1. Go to [Meta Developers Console](https://developers.facebook.com/)
2. Log in with your Meta account (or create one)
3. Create a new **App** (if you don't have one):
   - Go to **Apps** in top-left
   - Click **Create App**
   - Choose **Business** type
   - Fill in app name (e.g., "WhatsApp Flashcards Bot")
   - Click **Create App**
4. Once app is created, go to **Settings > User Tokens**
5. Generate a new token or copy existing one
6. Copy the entire token string

**Token looks like:** `EAABs...` (50-250 characters)

### 1.2 WHATSAPP_PHONE_NUMBER_ID

**Where to get it:**

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Select your WhatsApp Business Account
3. Go to **Settings > Phone Numbers**
4. Find your phone number and click it
5. Copy the **Phone Number ID** (WABA ID)
6. This is a numeric ID like: `102401234567890`

### 1.3 VERIFY_TOKEN

**Create this yourself:**

1. This is any random string you create (acts as a security password)
2. Example: `my_super_secret_webhook_token_24356` 
3. Make it at least 20 characters random

**How to create a random string:**

```bash
openssl rand -base64 32
# Output: aB3dE5fGhI7jK9lMnOpQrStUvWxYz1...

# Or use Python:
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 📝 Step 2: Create .env File

Create a file named `.env` in the project root (same directory as `server.js`):

```bash
# Copy from template
cp .env.example .env

# Edit with your values
nano .env
```

**Fill in these values:**

```env
WHATSAPP_TOKEN=EAABs...YourActualTokenHere...123ABC
WHATSAPP_PHONE_NUMBER_ID=102401234567890
VERIFY_TOKEN=my_super_secret_webhook_token_24356
PORT=3000
DATABASE_PATH=flashcards.db
NODE_ENV=development
```

**Verify .env is in .gitignore** (so secrets aren't committed):

```bash
grep ".env" .gitignore
# Should output: ".env"
```

---

## 🚀 Step 3: Start the Server Locally

### 3.1 Run the Server

```bash
npm start
```

**Expected output:**

```
==================================================
🤖 WhatsApp Flashcards Bot Starting...
==================================================

📊 Initializing database...
✓ Connected to SQLite database at flashcards.db
✓ Database schema initialized

✅ Server running on http://localhost:3000

📝 Make sure your webhook URL is set to:
   POST https://yourserver.com/webhook
   GET  https://yourserver.com/webhook

==================================================
```

### 3.2 Test the Health Endpoint

In another terminal:

```bash
curl http://localhost:3000/
```

**Expected response:**

```json
{
  "status": "ok",
  "message": "WhatsApp Flashcards Bot is running",
  "version": "1.0.0"
}
```

✅ **Server is running successfully!**

---

## 🌐 Step 4: Expose Server to Internet

WhatsApp needs to send webhooks to your server. If running locally, use a tunneling service.

### Option 1: ngrok (Recommended)

**Install ngrok:**

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

**Run ngrok:**

```bash
ngrok http 3000
```

**Output:**

```
ngrok                                                            (Ctrl+C to quit)

Build better APIs with ngrok. Early access: ngrok.com/beta
Session Status                online
Account                       your-email@example.com
Version                       3.0.7
Region                        us-california
Latency                        32ms
Web Interface                  http://127.0.0.1:4040

Forwarding                     https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL:** `https://abc123.ngrok.io`

This is your **webhook base URL**.

### Option 2: Expose with SSH Tunnel

```bash
ssh -R 80:localhost:3000 ssh.localhost.run
```

Keep this terminal open while testing.

---

## 🔗 Step 5: Configure Webhook in Meta Dashboard

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Select your app
3. Go to **WhatsApp > Configuration**
4. In **Webhook URL** field, enter:
   ```
   https://abc123.ngrok.io/webhook
   ```
   (Replace `abc123.ngrok.io` with your actual ngrok URL)

5. In **Verify Token** field, enter:
   ```
   my_super_secret_webhook_token_24356
   ```
   (Must match `VERIFY_TOKEN` in `.env`)

6. Click **Verify and Save**

**Expected result:** ✅ Webhook verified

If verification fails:
- Check `VERIFY_TOKEN` matches exactly
- Check webhook URL is correct
- Ensure server is running (`npm start` in another terminal)

---

## 🧪 Step 6: Send Test Message

### 6.1 Use Meta Sandbox

1. In **WhatsApp > Sandbox** (in Meta dashboard)
2. Scan the QR code with your WhatsApp
3. Message the test number

### 6.2 Monitor Server Logs

In the terminal where you ran `npm start`, you should see:**

```
📨 Incoming webhook: {
  "object": "whatsapp_business_account",
  "entry": [{...message data...}]
}
```

### 6.3 Check Response in WhatsApp

You should receive a message from the bot:

```
🎯 Welcome to Flashcards Bot!

What would you like to do?
```

With 3 buttons:
- ➕ Add Flashcard
- 📝 Start Quiz
- 📚 Browse Topics

✅ **Bot is working!**

---

## 📱 Step 7: End-to-End Testing

### Test Flow 1: Add Flashcard

```
→ Tap "➕ Add Flashcard"
← Bot shows topic list
→ Select "Biology" (or any topic)
← Bot: "Send me the question"
→ Send: "What is photosynthesis?"
← Bot: "Send me the answer"
→ Send: "Process of converting light energy..."
← Bot: "✅ Flashcard Added Successfully!"
```

**Database check:**

```bash
sqlite3 flashcards.db "SELECT * FROM flashcards LIMIT 1;"
```

Should return your flashcard.

### Test Flow 2: Start Quiz

```
→ Tap "📝 Start Quiz"
← Bot shows topic list
→ Select "Biology"
← Bot shows first question with 3 buttons
→ Tap "👁️ Show Answer"
← Bot shows answer + "✓ Got it!" button
→ Tap "✓ Got it!"
← Bot shows next question (or quiz end if only 1 card)
```

### Test Flow 3: Browse Topics

```
→ Tap "📚 Browse Topics"
← Bot shows topic list
→ Select "Biology"
← Bot shows first card with details + delete button
→ View card or delete
```

---

## 🐛 Troubleshooting

### Issue: Server won't start

**Error**: `Cannot find module 'dotenv'`

**Solution**:
```bash
npm install
```

**Error**: `Port 3000 already in use`

**Solution**:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill that process
kill -9 [PID]
```

### Issue: Webhook verification fails

**Error**: `Failed verification. Make sure VERIFY_TOKEN matches.`

**Solution**:
1. Check `.env` file:
   ```bash
   cat .env | grep VERIFY_TOKEN
   ```
2. Compare with Meta dashboard configuration
3. Make sure they match exactly (case-sensitive!)

### Issue: Can't send messages

**Error**: `Unauthorized (401)`

**Cause**: WHATSAPP_TOKEN is wrong or expired

**Solution**:
1. Get a new token from Meta dashboard
2. Update `.env`
3. Restart server: `npm start`

### Issue: No messages received

**Cause**: ngrok tunnel closed, webhook URL outdated

**Solution**:
1. Restart ngrok: `ngrok http 3000`
2. Copy new URL
3. Update webhook URL in Meta dashboard
4. Re-verify

### Issue: Database errors

**Error**: `SQLITE_CANTOPEN`

**Cause**: Permissions issue or path doesn't exist

**Solution**:
```bash
# Check current directory has write permission
touch flashcards.db && rm flashcards.db

# Or set explicit path in .env
export DATABASE_PATH="$HOME/flashcards.db"
npm start
```

---

## 📊 Production Deployment

Ready to go live? See README.md > Deployment for:
- Railway (free tier)
- Render.com
- Docker deployment
- Heroku alternatives

---

## 🗂️ Database Management

### View All Flashcards

```bash
sqlite3 flashcards.db "SELECT id, userId, topic, question, answer FROM flashcards LIMIT 10;"
```

### Delete All Flashcards (for testing)

```bash
sqlite3 flashcards.db "UPDATE flashcards SET deleted = 1;"
```

Or if you want to completely reset:

```bash
rm flashcards.db
npm start  # Creates fresh database
```

### Export to CSV

```bash
sqlite3 flashcards.db ".mode csv" ".output export.csv" "SELECT topic, question, answer FROM flashcards WHERE deleted = 0;" 
cat export.csv
```

---

## ✅ Final Verification Checklist

Before considering setup complete:

- [ ] Server starts without errors: `npm start`
- [ ] Health endpoint works: `curl http://localhost:3000/`
- [ ] Webhook verification succeeded in Meta dashboard
- [ ] Can send message to bot in WhatsApp
- [ ] Bot responds with main menu
- [ ] Can add flashcard successfully
- [ ] Flashcard appears in database
- [ ] Can start quiz and see questions
- [ ] Can browse topics

---

## 🎉 You're Done!

Your WhatsApp Flashcards Bot is ready to use!

### Next Steps

1. **Add more flashcards** via the WhatsApp bot
2. **Take a quiz** to test functionality
3. **Share with friends** (if using sandbox or production account)
4. **Customize features** by editing code in `src/`
5. **Deploy to cloud** when ready (see README.md)

### For Development

- Changes to code require server restart: `npm start`
- Database persists between restarts
- Logs show detailed debug info in development mode

---

## 📞 Need Help?

1. Check **Troubleshooting** section above
2. Review server logs: `npm start` output
3. Verify Environment Variables: `cat .env`
4. Check database: `sqlite3 flashcards.db ".tables"`
5. Review README.md for comprehensive documentation

---

## 📚 Files Reference

- `server.js` — Express server entry point
- `src/data/db.js` — SQLite setup
- `src/routes/webhook.js` — WhatsApp webhook
- `src/controllers/` — Request handlers
- `src/services/` — Business logic
- `src/ui/` — WhatsApp message builders
- `.env` — Your secrets (NEVER commit!)
- `flashcards.db` — Local database

---

**Good luck! 🚀**
