const UIBuilder = require('../ui');
const flashcardService = require('../services/flashcardService');

class BrowseController {
  /**
   * List all topics for browsing
   */
  static async listTopics(userId, phoneNumber) {
    try {
      const topics = await flashcardService.getTopics(userId);

      if (topics.length === 0) {
        await UIBuilder.sendError(phoneNumber, 'No topics available yet. Add your first flashcard!');
        await UIBuilder.sendMainMenu(userId, phoneNumber);
        return;
      }

      await UIBuilder.sendBrowseTopics(phoneNumber, topics);
    } catch (error) {
      console.error('Error listing topics:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * List all cards in a topic
   */
  static async listCardsByTopic(userId, phoneNumber, topic) {
    try {
      const cards = await flashcardService.getFlashcardsByTopic(userId, topic);

      if (cards.length === 0) {
        await UIBuilder.sendError(phoneNumber, `No cards in topic: ${topic}`);
        await UIBuilder.listTopics(userId, phoneNumber);
        return;
      }

      // Send first card with view options
      const firstCard = cards[0];
      await UIBuilder.sendFlashcardDetails(phoneNumber, firstCard.question, firstCard.answer, firstCard.id);

      // If multiple cards, offer to see more
      if (cards.length > 1) {
        await UIBuilder.sendText(
          phoneNumber,
          `📊 This topic has ${cards.length} cards total.\n\nTap the card above to view details or go back.`
        );
      }
    } catch (error) {
      console.error('Error listing cards by topic:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * View a specific flashcard
   */
  static async viewCard(userId, phoneNumber, cardId) {
    try {
      const card = await flashcardService.getFlashcardById(cardId, userId);

      if (!card) {
        throw new Error('Flashcard not found');
      }

      await UIBuilder.sendFlashcardDetails(phoneNumber, card.question, card.answer, cardId);
    } catch (error) {
      console.error('Error viewing card:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }
}

module.exports = BrowseController;
