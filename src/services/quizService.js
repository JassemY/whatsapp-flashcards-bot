const QUIZ_DATA = require('../data/quizData');

class QuizService {
  /**
   * Get all available topics
   */
  static getTopics() {
    return Object.keys(QUIZ_DATA).sort();
  }

  /**
   * Start a quiz for a topic
   * Returns randomized questions for that topic
   */
  static startQuiz(topic) {
    const questions = QUIZ_DATA[topic];

    if (!questions || questions.length === 0) {
      throw new Error(`No questions found for topic: ${topic}`);
    }

    // Return shuffled questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    return {
      topic,
      totalQuestions: shuffled.length,
      currentIndex: 0,
      questions: shuffled,
      currentQuestion: shuffled[0]
    };
  }

  /**
   * Get the next question in the quiz
   */
  static getNextQuestion(quizState, currentIndex) {
    const { questions, topic } = quizState;
    const nextIdx = currentIndex + 1;

    if (nextIdx >= questions.length) {
      return {
        isComplete: true,
        nextIndex: nextIdx
      };
    }

    return {
      isComplete: false,
      nextIndex: nextIdx,
      question: questions[nextIdx]
    };
  }

  /**
   * Check if answer is correct
   */
  static checkAnswer(question, answerNumber) {
    const answerIdx = parseInt(answerNumber, 10);

    if (isNaN(answerIdx) || answerIdx < 1 || answerIdx > 4) {
      return {
        valid: false,
        message: 'Please answer with a number: 1, 2, 3, or 4'
      };
    }

    const isCorrect = answerIdx === question.correctAnswer;
    const correctText = question.options[question.correctAnswer - 1];

    return {
      valid: true,
      isCorrect,
      selectedAnswer: question.options[answerIdx - 1],
      correctAnswer: correctText,
      feedback: isCorrect
        ? '✅ Correct!'
        : `❌ Wrong! The correct answer is: ${correctText}`
    };
  }
}

module.exports = QuizService;
