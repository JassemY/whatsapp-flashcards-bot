const WhatsAppAPI = require('../utils/whatsappAPI');
const payloadUtil = require('../utils/payload');
const quizController = require('./quizController');
const flashcardController = require('./flashcardController');
const browseController = require('./browseController');
const UIBuilder = require('../ui');

class MessageController {
  /**
   * Main entry point for handling incoming messages
   */
  static async handleIncomingMessage(body) {
    const message = body.entry[0].changes[0].value.messages[0];
    const phoneNumberObject = body.entry[0].changes[0].value.contacts[0];

    const phoneNumber = message.from;
    const userId = phoneNumber; // Use phone number as unique user identifier
    const messageId = message.id;

    console.log(`\n📱 Message from ${phoneNumber}:`, message);

    // Mark message as read
    try {
      await WhatsAppAPI.markMessageRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error.message);
    }

    // Route based on message type
    if (message.type === 'interactive') {
      await this.handleInteractiveMessage(userId, phoneNumber, message);
    } else if (message.type === 'text') {
      await this.handleTextMessage(userId, phoneNumber, message);
    } else {
      console.log('Unsupported message type:', message.type);
    }
  }

  /**
   * Handle interactive button/list selections
   */
  static async handleInteractiveMessage(userId, phoneNumber, message) {
    const interactive = message.interactive;
    let payload = null;
    let selectedValue = null;

    // Extract payload from button reply
    if (interactive.type === 'button_reply') {
      payload = interactive.button_reply.id;
    }
    // Extract payload from list selection
    else if (interactive.type === 'list_reply') {
      payload = interactive.list_reply.id;
    }

    if (!payload) {
      console.error('No payload found in interactive message');
      return;
    }

    console.log(`\n🔘 Interactive payload: ${payload}`);

    // Parse the payload action
    const action = payloadUtil.decode(payload);
    console.log('Decoded action:', action);

    // Route to appropriate controller based on action
    try {
      switch (action.main) {
        case 'MAIN_MENU':
          await UIBuilder.sendMainMenu(userId, phoneNumber);
          break;

        case 'START_QUIZ':
          if (action.topic) {
            // Start quiz with topic
            await quizController.startQuiz(phoneNumber, action.topic);
          } else {
            // Show topic selector
            await quizController.showTopicSelector(phoneNumber);
          }
          break;

        default:
          console.error('Unknown action:', action.main);
          await WhatsAppAPI.sendText(phoneNumber, '❌ Unknown action. Please try again.');
      }
    } catch (error) {
      console.error('Error processing action:', error.message);
      await WhatsAppAPI.sendText(phoneNumber, `❌ Error: ${error.message}`);
    }
  }

  /**
   * Handle text messages
   */
  static async handleTextMessage(userId, phoneNumber, message) {
    const text = message.text.body?.trim();

    console.log(`\n💬 Text from ${phoneNumber}: "${text}"`);

    const sessionService = require('../services/sessionService');
    const session = sessionService.getState(phoneNumber);

    // Check if user is in a quiz
    if (session?.state === 'IN_QUIZ') {
      // Text input is an answer (1, 2, 3, or 4)
      await quizController.handleAnswer(phoneNumber, text);
      return;
    }

    if (session?.state === 'QUIZ_ANSWER_GIVEN') {
      // Any text means continue to next question
      await quizController.handleContinue(phoneNumber);
      return;
    }

    // If not in quiz, show main menu
    try {
      await UIBuilder.sendMainMenu(userId, phoneNumber);
    } catch (error) {
      console.error('Error sending main menu:', error.message);
    }
  }
}

module.exports = MessageController;
