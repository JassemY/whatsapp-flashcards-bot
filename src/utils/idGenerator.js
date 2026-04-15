/**
 * ID Generator utility
 */

class IDGenerator {
  /**
   * Generate a unique ID
   */
  static generate() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}${randomPart}`;
  }

  /**
   * Generate a short unique ID (for payloads where space is tight)
   */
  static generateShort() {
    return Math.random().toString(36).substring(2, 10);
  }
}

module.exports = IDGenerator;
