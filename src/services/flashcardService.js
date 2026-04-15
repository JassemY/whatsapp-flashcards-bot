const db = require('../data/db');
const idGenerator = require('../utils/idGenerator');

class FlashcardService {
  /**
   * Add a new flashcard
   */
  static async addFlashcard(userId, topic, question, answer) {
    try {
      const id = idGenerator.generate();
      const createdAt = new Date().toISOString();

      await db.run(
        `INSERT INTO flashcards (id, userId, topic, question, answer, createdAt, correctCount, wrongCount, deleted)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0)`,
        [id, userId, topic, question, answer, createdAt]
      );

      console.log(`✓ Flashcard added: ${id} (${topic})`);
      return { id, userId, topic, question, answer, createdAt, correctCount: 0, wrongCount: 0 };
    } catch (error) {
      console.error('Error adding flashcard:', error.message);
      throw error;
    }
  }

  /**
   * Get all flashcards for a user in a specific topic
   */
  static async getFlashcardsByTopic(userId, topic) {
    try {
      const cards = await db.all(
        `SELECT * FROM flashcards 
         WHERE userId = ? AND topic = ? AND deleted = 0
         ORDER BY createdAt DESC`,
        [userId, topic]
      );

      return cards;
    } catch (error) {
      console.error('Error getting flashcards by topic:', error.message);
      throw error;
    }
  }

  /**
   * Get a single flashcard by ID
   */
  static async getFlashcardById(cardId, userId = null) {
    try {
      let sql = `SELECT * FROM flashcards WHERE id = ? AND deleted = 0`;
      const params = [cardId];

      if (userId) {
        sql += ` AND userId = ?`;
        params.push(userId);
      }

      const card = await db.get(sql, params);
      return card;
    } catch (error) {
      console.error('Error getting flashcard by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get all unique topics for a user
   */
  static async getTopics(userId) {
    try {
      const result = await db.all(
        `SELECT DISTINCT topic FROM flashcards 
         WHERE userId = ? AND deleted = 0
         ORDER BY topic ASC`,
        [userId]
      );

      return result.map((row) => row.topic);
    } catch (error) {
      console.error('Error getting topics:', error.message);
      throw error;
    }
  }

  /**
   * Update stats for a card (increment correct or wrong count)
   */
  static async updateStats(cardId, isCorrect, userId = null) {
    try {
      let sql = `UPDATE flashcards SET `;

      if (isCorrect) {
        sql += `correctCount = correctCount + 1`;
      } else {
        sql += `wrongCount = wrongCount + 1`;
      }

      sql += ` WHERE id = ? AND deleted = 0`;

      const params = [cardId];

      if (userId) {
        sql += ` AND userId = ?`;
        params.push(userId);
      }

      await db.run(sql, params);
      console.log(`✓ Stats updated for card ${cardId} (${isCorrect ? 'correct' : 'wrong'})`);
    } catch (error) {
      console.error('Error updating stats:', error.message);
      throw error;
    }
  }

  /**
   * Soft delete a flashcard
   */
  static async deleteFlashcard(cardId, userId) {
    try {
      await db.run(
        `UPDATE flashcards SET deleted = 1 WHERE id = ? AND userId = ?`,
        [cardId, userId]
      );

      console.log(`✓ Flashcard deleted: ${cardId}`);
    } catch (error) {
      console.error('Error deleting flashcard:', error.message);
      throw error;
    }
  }

  /**
   * Get stats for a user by topic
   */
  static async getStats(userId, topic = null) {
    try {
      let sql = `SELECT 
        COUNT(*) as total,
        SUM(correctCount) as correct,
        SUM(wrongCount) as wrong
        FROM flashcards 
        WHERE userId = ? AND deleted = 0`;

      const params = [userId];

      if (topic) {
        sql += ` AND topic = ?`;
        params.push(topic);
      }

      const stats = await db.get(sql, params);

      return {
        total: stats.total || 0,
        correct: stats.correct || 0,
        wrong: stats.wrong || 0,
        accuracy: stats.total > 0 ? ((stats.correct || 0) / (stats.total || 1)) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting stats:', error.message);
      throw error;
    }
  }

  /**
   * Get total count of flashcards for a user
   */
  static async getCardCount(userId) {
    try {
      const result = await db.get(
        `SELECT COUNT(*) as count FROM flashcards WHERE userId = ? AND deleted = 0`,
        [userId]
      );

      return result.count || 0;
    } catch (error) {
      console.error('Error getting card count:', error.message);
      throw error;
    }
  }
}

module.exports = FlashcardService;
