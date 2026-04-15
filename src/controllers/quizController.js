const UIBuilder = require('../ui');
const QuizService = require('../services/quizService');
const sessionService = require('../services/sessionService');

class QuizController {
  /**
   * Show topic selector to start a quiz
   */
  static async showTopicSelector(phoneNumber) {
    try {
      const topics = QuizService.getTopics();
      await UIBuilder.sendTopicSelector(phoneNumber, topics);
    } catch (error) {
      console.error('Error showing topic selector:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Start a quiz for a topic
   */
  static async startQuiz(phoneNumber, topic) {
    try {
      const quizState = QuizService.startQuiz(topic);

      // Store in session
      sessionService.setState(phoneNumber, 'IN_QUIZ', quizState);

      // Send first question
      const currentQuestion = quizState.currentQuestion;
      await UIBuilder.sendQuizQuestion(
        phoneNumber,
        currentQuestion,
        1,
        quizState.totalQuestions
      );
    } catch (error) {
      console.error('Error starting quiz:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
      await UIBuilder.sendMainMenu(null, phoneNumber);
    }
  }

  /**
   * Handle quiz answer (text: 1, 2, 3, or 4)
   */
  static async handleAnswer(phoneNumber, answerText) {
    try {
      const session = sessionService.getState(phoneNumber);

      if (!session || session.state !== 'IN_QUIZ') {
        await UIBuilder.sendError(phoneNumber, 'Quiz session not found');
        await UIBuilder.sendMainMenu(null, phoneNumber);
        return;
      }

      const quizState = session.data;
      const currentQuestion = quizState.currentQuestion;

      // Check answer
      const result = QuizService.checkAnswer(currentQuestion, answerText);

      if (!result.valid) {
        await UIBuilder.sendError(phoneNumber, result.message);
        return;
      }

      // Show feedback
      await UIBuilder.sendQuizFeedback(phoneNumber, result.feedback, true);

      // Update state to wait for "next"
      sessionService.setState(phoneNumber, 'QUIZ_ANSWER_GIVEN', {
        ...quizState,
        currentIndex: quizState.currentIndex + 1
      });
    } catch (error) {
      console.error('Error handling answer:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * Move to next question (called after answer feedback)
   */
  static async handleContinue(phoneNumber) {
    try {
      const session = sessionService.getState(phoneNumber);

      if (!session || session.state !== 'QUIZ_ANSWER_GIVEN') {
        // Might be user error, just show main menu
        await UIBuilder.sendMainMenu(null, phoneNumber);
        return;
      }

      const quizState = session.data;
      const nextResult = QuizService.getNextQuestion(quizState, quizState.currentIndex - 1);

      if (nextResult.isComplete) {
        // Quiz finished
        await UIBuilder.sendQuizComplete(phoneNumber);
        sessionService.clearState(phoneNumber);
      } else {
        // Show next question
        sessionService.setState(phoneNumber, 'IN_QUIZ', {
          ...quizState,
          currentIndex: nextResult.nextIndex,
          currentQuestion: nextResult.question
        });

        await UIBuilder.sendQuizQuestion(
          phoneNumber,
          nextResult.question,
          nextResult.nextIndex + 1,
          quizState.totalQuestions
        );
      }
    } catch (error) {
      console.error('Error continuing quiz:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }

  /**
   * End quiz and return to menu
   */
  static async endQuiz(phoneNumber) {
    try {
      sessionService.clearState(phoneNumber);
      await UIBuilder.sendSuccess(phoneNumber, 'Quiz ended');
      await UIBuilder.sendMainMenu(null, phoneNumber);
    } catch (error) {
      console.error('Error ending quiz:', error.message);
      await UIBuilder.sendError(phoneNumber, error.message);
    }
  }
}

module.exports = QuizController;
