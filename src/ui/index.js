const WhatsAppAPI = require('../utils/whatsappAPI');
const payloadUtil = require('../utils/payload');
const flashcardService = require('../services/flashcardService');

class UIBuilder {
  /**
   * Send main menu with 3 action buttons
   */
  static async sendMainMenu(userId, phoneNumber) {
    const buttons = [
      {
        id: payloadUtil.encode({ main: 'ADD_CARD_START' }),
        title: '➕ Add Flashcard'
      },
      {
        id: payloadUtil.encode({ main: 'START_QUIZ' }),
        title: '📝 Start Quiz'
      },
      {
        id: payloadUtil.encode({ main: 'BROWSE_TOPICS' }),
        title: '📚 Browse Topics'
      }
    ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      '🎯 Welcome to Flashcards Bot!\n\nWhat would you like to do?',
      buttons,
      '📖 Flashcards Bot'
    );
  }

  /**
   * Send topic selection list
   */
  static async sendTopicSelector(userId, phoneNumber, topics = []) {
    // If no topics, show message and return to main menu
    if (topics.length === 0) {
      await WhatsAppAPI.sendText(phoneNumber, '📚 No topics yet. Add your first flashcard!');
      return UIBuilder.sendMainMenu(userId, phoneNumber);
    }

    // Create list items from topics
    const rows = topics.map((topic) => ({
      id: payloadUtil.encode({ main: 'START_QUIZ', topic }),
      title: topic,
      description: `Start quiz for ${topic}`
    }));

    const sections = [
      {
        title: 'Available Topics',
        rows
      }
    ];

    return WhatsAppAPI.sendList(
      phoneNumber,
      '📚 Select a topic to start a quiz:',
      sections,
      'Choose Topic'
    );
  }

  /**
   * Send quiz question with answer/next/end buttons
   */
  static async sendQuizQuestion(phoneNumber, question, cardId, topic, cardIdx) {
    const buttons = [
      {
        id: payloadUtil.encode({ main: 'QUIZ_SHOW_ANSWER', cardId }),
        title: '👁️ Show Answer'
      },
      {
        id: payloadUtil.encode({ main: 'QUIZ_NEXT', topic, cardIdx: cardIdx + 1 }),
        title: '⏭️ Next'
      },
      {
        id: payloadUtil.encode({ main: 'QUIZ_END' }),
        title: '❌ End Quiz'
      }
    ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      `❓ Question:\n\n${question}`,
      buttons,
      '📝 Quiz Mode'
    );
  }

  /**
   * Send quiz answer with next/end buttons
   */
  static async sendQuizAnswer(phoneNumber, question, answer, topic, cardIdx) {
    const buttons = [
      {
        id: payloadUtil.encode({ main: 'QUIZ_NEXT', topic, cardIdx }),
        title: '✓ Got it!'
      },
      {
        id: payloadUtil.encode({ main: 'QUIZ_END' }),
        title: '❌ End Quiz'
      }
    ];

    const bodyText = `❓ Question:\n${question}\n\n✅ Answer:\n${answer}`;

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      bodyText,
      buttons,
      '📝 Quiz Mode'
    );
  }

  /**
   * Send quiz end summary
   */
  static async sendQuizEnd(phoneNumber, stats) {
    const summary = `
📊 Quiz Complete!

Total Cards Attempted: ${stats.total}
✅ Correct: ${stats.correct}
❌ Wrong: ${stats.wrong}
📈 Accuracy: ${stats.accuracy.toFixed(1)}%

Great job! 🎉
    `.trim();

    const buttons = [
      {
        id: payloadUtil.encode({ main: 'MAIN_MENU' }),
        title: '🏠 Main Menu'
      }
    ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      summary,
      buttons
    );
  }

  /**
   * Send add flashcard step 1 - topic selector
   */
  static async sendAddCardTopicSelector(userId, phoneNumber) {
    // Get existing topics or create default list
    try {
      const topics = await flashcardService.getTopics(userId);
      const topicList = topics.length > 0 ? topics : ['Biology', 'History', 'Geography', 'Other'];

      // Create list items (max 10 per section in WhatsApp)
      const rows = topicList.slice(0, 10).map((topic) => ({
        id: payloadUtil.encode({ main: 'ADD_CARD_TOPIC', topic }),
        title: topic,
        description: `Add card to ${topic}`
      }));

      const sections = [
        {
          title: 'Select a Topic',
          rows
        }
      ];

      return WhatsAppAPI.sendList(
        phoneNumber,
        '📚 Which topic would you like to add to?',
        sections,
        'Choose Topic'
      );
    } catch (error) {
      console.error('Error in sendAddCardTopicSelector:', error);
      throw error;
    }
  }

  /**
   * Send add flashcard step 2 - ask for question
   */
  static async sendAddCardQuestionPrompt(phoneNumber, topic) {
    const message = `\n✏️ Great! You selected: ${topic}\n\nNext, send me the *question* for your flashcard.\n\nExample:\n"What is photosynthesis?"`;

    return WhatsAppAPI.sendText(phoneNumber, message);
  }

  /**
   * Send add flashcard step 3 - ask for answer
   */
  static async sendAddCardAnswerPrompt(phoneNumber, topic, question) {
    const message = `\n✏️ Question: ${question}\n\nNow send me the *answer* for this flashcard.\n\nExample:\n"Photosynthesis is the process by which plants convert light energy into chemical energy."`;

    return WhatsAppAPI.sendText(phoneNumber, message);
  }

  /**
   * Send flashcard confirmation
   */
  static async sendFlashcardConfirmation(phoneNumber, topic, question, answer) {
    const confirmText = `
✅ Flashcard Added Successfully!

📚 Topic: ${topic}
❓ Question: ${question}
✅ Answer: ${answer}

Your card is ready for quizzes!
    `.trim();

    const buttons = [
      {
        id: payloadUtil.encode({ main: 'MAIN_MENU' }),
        title: '🏠 Main Menu'
      }
    ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      confirmText,
      buttons
    );
  }

  /**
   * Send browse topics list
   */
  static async sendBrowseTopics(phoneNumber, topics = []) {
    if (topics.length === 0) {
      await WhatsAppAPI.sendText(phoneNumber, '📚 No topics available yet.');
      return UIBuilder.sendMainMenu(null, phoneNumber);
    }

    const rows = topics.map((topic) => ({
      id: payloadUtil.encode({ main: 'BROWSE_TOPIC_CARDS', topic }),
      title: topic,
      description: 'View all cards in this topic'
    }));

    const sections = [
      {
        title: 'Your Topics',
        rows: rows.slice(0, 10) // WhatsApp limit
      }
    ];

    return WhatsAppAPI.sendList(
      phoneNumber,
      '📚 Select a topic to view cards:',
      sections,
      'View Cards'
    );
  }

  /**
   * Send flashcard details with action buttons
   */
  static async sendFlashcardDetails(phoneNumber, question, answer, cardId, allowDelete = true) {
    const cardText = `
❓ Question:
${question}

✅ Answer:
${answer}
    `.trim();

    const buttons = allowDelete
      ? [
          {
            id: payloadUtil.encode({ main: 'DELETE_CARD', cardId }),
            title: '🗑️ Delete'
          },
          {
            id: payloadUtil.encode({ main: 'MAIN_MENU' }),
            title: '🏠 Back'
          }
        ]
      : [
          {
            id: payloadUtil.encode({ main: 'MAIN_MENU' }),
            title: '🏠 Back'
          }
        ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      cardText,
      buttons,
      '📇 Flashcard View'
    );
  }

  /**
   * Send error message
   */
  static async sendError(phoneNumber, errorMessage) {
    return WhatsAppAPI.sendText(phoneNumber, `❌ Error: ${errorMessage}`);
  }

  /**
   * Send success message
   */
  static async sendSuccess(phoneNumber, successMessage) {
    return WhatsAppAPI.sendText(phoneNumber, `✅ ${successMessage}`);
  }
}

module.exports = UIBuilder;
