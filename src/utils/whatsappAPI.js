const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v25.0';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN?.trim();
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

// Debug: Log token details on load
if (!WHATSAPP_TOKEN) {
  console.error('⚠️  WHATSAPP_TOKEN is empty or undefined!');
}
if (WHATSAPP_TOKEN) {
  console.log(`✓ Token loaded: ${WHATSAPP_TOKEN.substring(0, 10)}...${WHATSAPP_TOKEN.substring(WHATSAPP_TOKEN.length - 10)} (${WHATSAPP_TOKEN.length} chars)`);
}

class WhatsAppAPI {
  /**
   * Send a simple text message
   */
  static async sendText(phoneNumber, text) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: text }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending text message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send interactive message with buttons
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} bodyText - Main message text
   * @param {Array} buttons - Array of button objects: { id, title }
   * @param {string} headerText - Optional header text
   * @param {string} footerText - Optional footer text
   */
  static async sendInteractiveButtons(phoneNumber, bodyText, buttons, headerText = null, footerText = null) {
    try {
      const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: bodyText },
          action: {
            buttons: buttons.map((btn) => ({
              type: 'reply',
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          }
        }
      };

      if (headerText) {
        message.interactive.header = {
          type: 'text',
          text: headerText
        };
      }

      if (footerText) {
        message.interactive.footer = { text: footerText };
      }

      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        message,
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending interactive buttons:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send list message
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} bodyText - Message text
   * @param {Array} sections - Array of section objects: { title, rows: [{ id, title, description }] }
   * @param {string} buttonText - Button label (max 20 chars)
   * @param {string} headerText - Optional header
   * @param {string} footerText - Optional footer
   */
  static async sendList(phoneNumber, bodyText, sections, buttonText = 'Select', headerText = null, footerText = null) {
    try {
      const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: { text: bodyText },
          action: {
            button: buttonText,
            sections: sections
          }
        }
      };

      if (headerText) {
        message.interactive.header = {
          type: 'text',
          text: headerText
        };
      }

      if (footerText) {
        message.interactive.footer = { text: footerText };
      }

      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        message,
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending list message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send media message (image, document, etc.)
   */
  static async sendMedia(phoneNumber, mediaUrl, mediaType) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: mediaType,
          [mediaType]: {
            link: mediaUrl
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending media:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  static async markMessageRead(messageId) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = WhatsAppAPI;
