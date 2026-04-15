/**
 * Payload utility for encoding/decoding action payloads
 * WhatsApp button IDs are limited to 256 characters, so we use a compact format
 */

class PayloadUtil {
  /**
   * Encode an action object into a payload string
   * Format examples:
   *   "MAIN_MENU"
   *   "ADD_CARD_START"
   *   "ADD_CARD_TOPIC|bio"
   *   "QUIZ_SHOW_ANSWER|cardId123"
   *   "QUIZ_NEXT|bio|2"
   *   "DELETE_CARD|cardId456"
   */
  static encode(action) {
    if (typeof action === 'string') {
      return action;
    }

    const main = action.main || '';
    const parts = [main];

    // Add parameters based on action type
    if (action.topic) parts.push(action.topic);
    if (action.cardId) parts.push(action.cardId);
    if (action.cardIdx !== undefined) parts.push(action.cardIdx.toString());
    if (action.question) parts.push(encodeURIComponent(action.question));
    if (action.answer) parts.push(encodeURIComponent(action.answer));

    const payload = parts.join('|');

    // Verify payload doesn't exceed WhatsApp limit
    if (payload.length > 256) {
      throw new Error(`Payload exceeds 256 character limit: ${payload.length} chars`);
    }

    return payload;
  }

  /**
   * Decode a payload string into an action object
   */
  static decode(payload) {
    if (!payload) {
      throw new Error('Payload is empty');
    }

    const parts = payload.split('|');
    const main = parts[0];

    const action = { main };

    // Parse parameters based on action type
    switch (main) {
      case 'ADD_CARD_TOPIC':
        action.topic = parts[1] || '';
        break;

      case 'ADD_CARD_QUESTION':
        action.topic = parts[1] || '';
        action.question = parts[2] ? decodeURIComponent(parts[2]) : '';
        break;

      case 'ADD_CARD_ANSWER':
        action.topic = parts[1] || '';
        action.question = parts[2] ? decodeURIComponent(parts[2]) : '';
        action.answer = parts[3] ? decodeURIComponent(parts[3]) : '';
        break;

      case 'START_QUIZ':
        action.topic = parts[1] || '';
        break;

      case 'QUIZ_SHOW_ANSWER':
        action.cardId = parts[1] || '';
        break;

      case 'QUIZ_NEXT':
        action.topic = parts[1] || '';
        action.cardIdx = parseInt(parts[2], 10) || 0;
        break;

      case 'BROWSE_TOPIC_CARDS':
        action.topic = parts[1] || '';
        break;

      case 'DELETE_CARD':
        action.cardId = parts[1] || '';
        break;

      default:
        // For simple actions with no parameters
        break;
    }

    return action;
  }
}

module.exports = PayloadUtil;
