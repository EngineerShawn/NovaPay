// backend/src/services/verificationService.js

const fs = require('fs').promises;
const path = require('path');

// Define the path to the verification codes file.
const verificationFilePath = path.join(__dirname, '../../data/verificationCodes.json');

// In-memory store for verification codes.
// Helper function to read the verification codes from the JSON file.
async function readVerificationStore() {
    try {
      const data = await fs.readFile(verificationFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist, return an empty store.
      if (error.code === 'ENOENT') {
        return {};
      } else {
        throw error;
      }
    }
  }

  // Helper function to write the verification codes to the JSON file.
  async function writeVerificationStore(store) {
    try {
      await fs.writeFile(verificationFilePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (error) {
      console.error("Error writing verification store:", error);
      throw error;
    }
  }

/**
 * Store the verification code for a contact.
 * @param {string} contact - The user's phone or email.
 * @param {number} code - The 6-digit verification code.
 */
exports.storeCode = async (contact, code) => {
    const store = await readVerificationStore();
   // Store the verification code along with a timestamp (optional for future use)
   store[contact] = { code, timestamp: Date.now() };
   await writeVerificationStore(store);
 };

/**
 * Verify the code provided by the user.
 * @param {string} contact - The user's phone or email.
 * @param {number|string} code - The code input by the user.
 * @returns {boolean} - True if valid, false otherwise.
 */
exports.verifyCode = async (contact, code) => {
    const store = await readVerificationStore();
    const record = store[contact];
    if (!record) {
      return false;
    }
    if (record.code.toString() === code.toString()) {
      // Remove the code after successful verification.
      delete store[contact];
      await writeVerificationStore(store);
      return true;
    }
    return false;
  };
