// backend/utils/smsService.js
// Production-ready SMS service integration.
// Replace the stub with integration to your chosen free SMS provider.

module.exports.sendSMS = async (phone, message) => {
    // For now, we’re just logging the SMS message.
    // In production, integrate with a provider (Twilio, Firebase, etc.) and use process.env.SMS_API_KEY.
    console.log(`Sending SMS to ${phone}: ${message}`);
    return Promise.resolve();
  };
  