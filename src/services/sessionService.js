/**
 * Session Service - tracks user state in-memory
 * Since WhatsApp is stateless, we decode state from payloads and don't need persistent sessions
 * This is mainly for tracking temporary user context during multi-step operations
 */

class SessionService {
  constructor() {
    this.sessions = {}; // { userId: { state, data, timestamp } }
    this.SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    this.startCleanupInterval();
  }

  /**
   * Set user state
   */
  setState(userId, state, data = {}) {
    this.sessions[userId] = {
      state,
      data,
      timestamp: Date.now()
    };

    console.log(`[SESSION] Set state for ${userId}: ${state}`);
  }

  /**
   * Get user state
   */
  getState(userId) {
    if (!this.sessions[userId]) {
      return null;
    }

    const session = this.sessions[userId];
    // Check if session has expired
    if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
      delete this.sessions[userId];
      console.log(`[SESSION] Session expired for ${userId}`);
      return null;
    }

    return session;
  }

  /**
   * Get full session object
   */
  getFullSession(userId) {
    return this.getState(userId);
  }

  /**
   * Clear user state
   */
  clearState(userId) {
    if (this.sessions[userId]) {
      delete this.sessions[userId];
      console.log(`[SESSION] Cleared state for ${userId}`);
    }
  }

  /**
   * Start automatic cleanup of expired sessions every 5 minutes
   */
  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const userId in this.sessions) {
        if (now - this.sessions[userId].timestamp > this.SESSION_TIMEOUT) {
          delete this.sessions[userId];
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[SESSION] Cleaned up ${cleaned} expired sessions`);
      }
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  /**
   * Get all active sessions (for debugging)
   */
  getAllSessions() {
    return Object.keys(this.sessions).length;
  }
}

// Singleton
const sessionService = new SessionService();

module.exports = sessionService;
