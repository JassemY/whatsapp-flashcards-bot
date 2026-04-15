const express = require('express');
const webhookRoute = require('./webhook');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'WhatsApp Flashcards Bot is running',
    version: '1.0.0'
  });
});

/**
 * Webhook routes
 */
router.use('/', webhookRoute);

module.exports = router;
