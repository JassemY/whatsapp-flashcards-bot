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

        case 'ADD_CARD_START':
          await flashcardController.initiateAdd(userId, phoneNumber);
          break;

        case 'ADD_CARD_TOPIC':
          await flashcardController.confirmTopic(userId, phoneNumber, action.topic);
          break;

        case 'ADD_CARD_QUESTION':
          await flashcardController.confirmQuestion(userId, phoneNumber, action.topic, action.question);
          break;

        case 'ADD_CARD_ANSWER':
          await flashcardController.saveFlashcard(userId, phoneNumber, action.topic, action.question, action.answer);
          break;

        case 'START_QUIZ':
          await quizController.startQuiz(userId, phoneNumber, action.topic);
          break;

        case 'QUIZ_SHOW_ANSWER':
          await quizController.showAnswer(userId, phoneNumber, action.cardId);
          break;

        case 'QUIZ_NEXT':
          await quizController.nextCard(userId, phoneNumber, action.topic, action.cardIdx);
          break;

        case 'QUIZ_END':
          await quizController.endQuiz(userId, phoneNumber);
          break;

        case 'BROWSE_TOPICS':
          await browseController.listTopics(userId, phoneNumber);
          break;

        case 'BROWSE_TOPIC_CARDS':
          await browseController.listCardsByTopic(userId, phoneNumber, action.topic);
          break;

        case 'DELETE_CARD':
          await flashcardController.deleteFlashcard(userId, phoneNumber, action.cardId);
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
    const text = message.text.body;

    console.log(`\n💬 Text from ${phoneNumber}: "${text}"`);

    // For now, text is only allowed in specific contexts (add flashcard question/answer)
    // We will handle this in the flashcard controller context
    // For other text messages, send main menu
    try {
      await UIBuilder.sendMainMenu(userId, phoneNumber);
    } catch (error) {
      console.error('Error sending main menu:', error.message);
    }
  }
}

module.exports = MessageController;
