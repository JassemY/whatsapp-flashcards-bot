# ⚡ WhatsApp Flashcards Bot — Quick Start (5 minutes)

## TL;DR for the Impatient

```bash
# 1. Clone/download this project
cd whatsapp-flashcards-bot

# 2. Install dependencies
npm install

# 3. Create .env with your WhatsApp credentials
cp .env.example .env
# Edit .env with WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN

# 4. Expose webhook (in separate terminal)
ngrok http 3000

# 5. Update webhook in Meta dashboard:
# https://developers.facebook.com/apps > Your App > WhatsApp > Configuration
# Webhook URL: https://[ngrok-url].ngrok.io/webhook
# Verify Token: [your VERIFY_TOKEN from .env]

# 6. Run the bot
npm start

# 7. Send message to your WhatsApp number
# Bot responds with main menu → Add cards → Take quizzes → Browse → etc.
```

## Where to Get Credentials (30 seconds each)

| Credential | Where | How |
|-----------|-------|-----|
| **WHATSAPP_TOKEN** | [Meta Developers](https://developers.facebook.com/) | Settings > User Tokens > Copy token |
| **PHONE_NUMBER_ID** | [Meta Business Suite](https://business.facebook.com/) | WhatsApp > Settings > Phone Numbers > (numeric ID) |
| **VERIFY_TOKEN** | You create it | Can be any random string: `my_secure_token_12345` |

## Expose Locally

```bash
# If you have ngrok installed:
ngrok http 3000

# Keep this running in a separate terminal!
```

## What You Get

✅ WhatsApp-only interface (no web UI)  
✅ Add flashcards via buttons + text  
✅ Quiz mode with scoring  
✅ Browse all topics  
✅ Delete cards  
✅ SQLite database (persists forever)  
✅ Completely free  
✅ Deploy anywhere (local, Railway, Heroku, Docker, etc.)

---

## Reference

- **Setup details**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Full documentation**: See [README.md](./README.md)
- **Git workflow**: See [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md)
- **Troubleshooting**: [README.md#-troubleshooting](./README.md#-troubleshooting)

---

## 🚀 One-Liner to Get Started

```bash
npm install && cp .env.example .env && echo "✅ Ready! Edit .env with your credentials, then: npm start"
```
