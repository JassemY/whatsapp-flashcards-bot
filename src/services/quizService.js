const flashcardService = require('./flashcardService');

class QuizService {
  /**
   * Start a quiz for a topic
   * Returns the first card in the quiz
   */
  static async startQuiz(userId, topic) {
    try {
      const cards = await flashcardService.getFlashcardsByTopic(userId, topic);

      if (cards.length === 0) {
        throw new Error(`No flashcards found for topic: ${topic}`);
      }

      // Return quiz state with first card and all cards
      return {
        topic,
        totalCards: cards.length,
        currentIndex: 0,
        cards,
        currentCard: cards[0],
        correct: 0,
        wrong: 0
      };
    } catch (error) {
      console.error('Error starting quiz:', error.message);
      throw error;
    }
  }

  /**
   * Get the next card in a quiz
   */
  static async getNextCard(userId, topic, cardIdx) {
    try {
      const cards = await flashcardService.getFlashcardsByTopic(userId, topic);

      if (cards.length === 0) {
        throw new Error(`No flashcards found for topic: ${topic}`);
      }

      // If we've reached the end of cards, cycle back to start or end quiz
      const nextIdx = cardIdx % cards.length;
      const nextCard = cards[nextIdx];

      return {
        card: nextCard,
        index: nextIdx,
        isEnd: cardIdx >= cards.length
      };
    } catch (error) {
      console.error('Error getting next card:', error.message);
      throw error;
    }
  }

  /**
   * Record answer and update stats
   */
  static async recordAnswer(cardId, userId, isCorrect) {
    try {
      await flashcardService.updateStats(cardId, isCorrect, userId);
      return true;
    } catch (error) {
      console.error('Error recording answer:', error.message);
      throw error;
    }
  }

  /**
   * Get quiz summary stats
   */
  static async getQuizStats(userId, topic) {
    try {
      return await flashcardService.getStats(userId, topic);
    } catch (error) {
      console.error('Error getting quiz stats:', error.message);
      throw error;
    }
  }
}

module.exports = QuizService;
