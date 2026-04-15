require('dotenv').config();
const express = require('express');
const db = require('./src/data/db');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

/**
 * Start server
 */
async function start() {
  try {
    console.log(`\n${'='.repeat(50)}`);
    console.log('🤖 WhatsApp Flashcards Bot Starting...');
    console.log(`${'='.repeat(50)}\n`);

    // Validate environment variables
    const requiredEnvVars = ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'VERIFY_TOKEN'];
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach((varName) => {
        console.error(`   - ${varName}`);
      });
      console.error('\n📝 Please copy .env.example to .env and fill in the values.');
      process.exit(1);
    }

    // Initialize database
    console.log('📊 Initializing database...');
    await db.initialize();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`\n📝 Make sure your webhook URL is set to:`);
      console.log(`   POST https://yourserver.com/webhook`);
      console.log(`   GET  https://yourserver.com/webhook\n`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

// Start the server
start();
