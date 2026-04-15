const UIBuilder = require('../ui');
const flashcardService = require('../services/flashcardService');
const sessionService = require('../services/sessionService');

class FlashcardController {
  /**
   * Initiate adding a new flashcard - show topic selector
   */
  static async initiateAdd(userId, phoneNumber) {
    try {
      sessionService.setState(userId, 'ADDING_CARD', {
        step: 'SELECT_TOPIC'
      });

      await UIBuilder.sendAddCardTopicSelector(userId, phoneNumber);
    } catch (error) {
      console.error('Error initiating add card:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Confirm topic and ask for question
   */
  static async confirmTopic(userId, phoneNumber, topic) {
    try {
      sessionService.setState(userId, 'ADDING_CARD', {
        step: 'ENTER_QUESTION',
        topic
      });

      await UIBuilder.sendAddCardQuestionPrompt(phoneNumber, topic);
    } catch (error) {
      console.error('Error confirming topic:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Store question and ask for answer
   * This is called when user sends a text message with the question
   */
  static async confirmQuestion(userId, phoneNumber, topic, question) {
    try {
      if (!question || question.trim().length === 0) {
        await UIBuilder.sendError(phoneNumber, 'Question cannot be empty');
        await UIBuilder.sendAddCardQuestionPrompt(phoneNumber, topic);
        return;
      }

      sessionService.setState(userId, 'ADDING_CARD', {
        step: 'ENTER_ANSWER',
        topic,
        question: question.trim()
      });

      await UIBuilder.sendAddCardAnswerPrompt(phoneNumber, topic, question.trim());
    } catch (error) {
      console.error('Error confirming question:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Save the flashcard to database
   * This is called when user sends a text message with the answer
   */
  static async saveFlashcard(userId, phoneNumber, topic, question, answer) {
    try {
      if (!answer || answer.trim().length === 0) {
        await UIBuilder.sendError(phoneNumber, 'Answer cannot be empty');
        await UIBuilder.sendAddCardAnswerPrompt(phoneNumber, topic, question);
        return;
      }

      const cleanAnswer = answer.trim();

      // Save to database
      await flashcardService.addFlashcard(userId, topic, question, cleanAnswer);

      // Send confirmation
      await UIBuilder.sendFlashcardConfirmation(phoneNumber, topic, question, cleanAnswer);

      // Clear session
      sessionService.clearState(userId);
    } catch (error) {
      console.error('Error saving flashcard:', error.message);
      if (error.message.includes('UNIQUE')) {
        await UIBuilder.sendError(phoneNumber, 'This flashcard already exists for this topic');
      } else {
        await UIBuilder.sendError(phoneNumber, error.message);
      }
    }
  }

  /**
   * Delete a flashcard
   */
  static async deleteFlashcard(userId, phoneNumber, cardId) {
    try {
      const card = await flashcardService.getFlashcardById(cardId, userId);

      if (!card) {
        throw new Error('Flashcard not found');
      }

      // Soft delete
      await flashcardService.deleteFlashcard(cardId, userId);

      // Send confirmation
      await UIBuilder.sendSuccess(phoneNumber, 'Flashcard deleted successfully');

      // Return to main menu
      await UIBuilder.sendMainMenu(userId, phoneNumber);
    } catch (error) {
      console.error('Error deleting flashcard:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }
}

module.exports = FlashcardController;
