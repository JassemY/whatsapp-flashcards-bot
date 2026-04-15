const UIBuilder = require('../ui');
const quizService = require('../services/quizService');
const flashcardService = require('../services/flashcardService');
const sessionService = require('../services/sessionService');

class QuizController {
  /**
   * Start a quiz for a topic
   */
  static async startQuiz(userId, phoneNumber, topic) {
    try {
      // Start the quiz
      const quizState = await quizService.startQuiz(userId, topic);

      // Store in session
      sessionService.setState(userId, 'IN_QUIZ', {
        topic,
        currentIndex: 0,
        cards: quizState.cards,
        correct: 0,
        wrong: 0
      });

      // Send first question
      const firstCard = quizState.currentCard;
      await UIBuilder.sendQuizQuestion(phoneNumber, firstCard.question, firstCard.id, topic, 0);
    } catch (error) {
      console.error('Error starting quiz:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
      await UIBuilder.sendMainMenu(userId, phoneNumber);
    }
  }

  /**
   * Show answer for current card
   */
  static async showAnswer(userId, phoneNumber, cardId) {
    try {
      const card = await flashcardService.getFlashcardById(cardId, userId);

      if (!card) {
        throw new Error('Flashcard not found');
      }

      const session = sessionService.getState(userId);

      if (!session || session.state !== 'IN_QUIZ') {
        throw new Error('Quiz session not found');
      }

      const { topic } = session.data;

      // Send answer with next button, don't increment yet
      await UIBuilder.sendQuizAnswer(
        phoneNumber,
        card.question,
        card.answer,
        topic,
        session.data.currentIndex + 1
      );
    } catch (error) {
      console.error('Error showing answer:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Move to next card in quiz
   */
  static async nextCard(userId, phoneNumber, topic, cardIdx) {
    try {
      const session = sessionService.getState(userId);

      if (!session || session.state !== 'IN_QUIZ') {
        throw new Error('Quiz session not found');
      }

      const { cards } = session.data;

      // Check if quiz is over
      if (cardIdx >= cards.length) {
        // Quiz complete
        await this.endQuiz(userId, phoneNumber);
        return;
      }

      // Update session with new index
      sessionService.setState(userId, 'IN_QUIZ', {
        ...session.data,
        currentIndex: cardIdx
      });

      // Get next card
      const nextCard = cards[cardIdx];

      if (!nextCard) {
        await this.endQuiz(userId, phoneNumber);
        return;
      }

      // Send next question
      await UIBuilder.sendQuizQuestion(phoneNumber, nextCard.question, nextCard.id, topic, cardIdx);
    } catch (error) {
      console.error('Error moving to next card:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * End quiz and show stats
   */
  static async endQuiz(userId, phoneNumber) {
    try {
      const session = sessionService.getState(userId);

      if (!session || session.state !== 'IN_QUIZ') {
        await UIBuilder.sendMainMenu(userId, phoneNumber);
        return;
      }

      const { topic, currentIndex, cards } = session.data;

      // Get stats from database
      const stats = await quizService.getQuizStats(userId, topic);

      // Send summary
      await UIBuilder.sendQuizEnd(phoneNumber, stats);

      // Clear session
      sessionService.clearState(userId);
    } catch (error) {
      console.error('Error ending quiz:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
      await UIBuilder.sendMainMenu(userId, phoneNumber);
    }
  }
}

module.exports = QuizController;
