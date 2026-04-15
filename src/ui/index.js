const WhatsAppAPI = require('../utils/whatsappAPI');
const payloadUtil = require('../utils/payload');
const flashcardService = require('../services/flashcardService');

class UIBuilder {
  /**
   * Send main menu with Start Quiz button
   */
  static async sendMainMenu(userId, phoneNumber) {
    const buttons = [
      {
        id: payloadUtil.encode({ main: 'START_QUIZ' }),
        title: '📝 Start Quiz'
      }
    ];

    return WhatsAppAPI.sendInteractiveButtons(
      phoneNumber,
      '🎯 Welcome to Quiz Bot!\n\nSelect a topic and test your knowledge with multiple-choice questions.',
      buttons,
      '📖 Quiz Bot'
    );
  }

  /**
   * Send topic selection list
   */
  static async sendTopicSelector(phoneNumber, topics = []) {
    if (topics.length === 0) {
      await WhatsAppAPI.sendText(phoneNumber, '📚 No topics available.');
      return UIBuilder.sendMainMenu(null, phoneNumber);
    }

    const rows = topics.map((topic) => ({
      id: payloadUtil.encode({ main: 'START_QUIZ', topic }),
      title: topic,
      description: `Start quiz for ${topic}`
    }));

    const sections = [
      {
        title: 'Available Topics',
        rows: rows.slice(0, 10)
      }
    ];

    return WhatsAppAPI.sendList(
      phoneNumber,
      '📚 Choose a topic to start a quiz:',
      sections,
      'Start Quiz'
    );
  }

  /**
   * Send quiz question with 4 multiple choice options (plain text)
   */
  static async sendQuizQuestion(phoneNumber, question, questionNumber, totalQuestions) {
    const optionsText = question.options
      .map((option, idx) => `${idx + 1}. ${option}`)
      .join('\n');

    const message = `
📝 Question ${questionNumber}/${totalQuestions}

${question.question}

${optionsText}

Reply with: 1, 2, 3, or 4
    `.trim();

    return WhatsAppAPI.sendText(phoneNumber, message);
  }

  /**
   * Send quiz answer feedback
   */
  static async sendQuizFeedback(phoneNumber, feedback, nextAvailable = true) {
    let message = feedback;

    if (nextAvailable) {
      message += '\n\n📤 Send anything to continue to next question...';
    }

    return WhatsAppAPI.sendText(phoneNumber, message);
  }

  /**
   * Send quiz complete message
   */
  static async sendQuizComplete(phoneNumber) {
    const message = `
✅ Quiz Complete!

Great job! You finished all questions.

📤 Send anything to return to main menu...
    `.trim();

    return WhatsAppAPI.sendText(phoneNumber, message);
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
