const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

/**
 * GET /webhook
 * Webhook verification endpoint for WhatsApp Cloud API
 */
router.get('/webhook', (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verify the token
  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✓ Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Failed verification. Make sure VERIFY_TOKEN matches.');
    }
  } else {
    res.status(400).send('Missing verify token or mode.');
  }
});

/**
 * POST /webhook
 * Receive incoming messages from WhatsApp
 */
router.post('/webhook', async (req, res) => {
  const body = req.body;

  console.log('\n📨 Incoming webhook:', JSON.stringify(body, null, 2));

  // WhatsApp sends messages in a specific format
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      try {
        await messageController.handleIncomingMessage(body);
      } catch (error) {
        console.error('Error handling incoming message:', error.message);
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(404).send('Not Found');
  }
});

module.exports = router;
