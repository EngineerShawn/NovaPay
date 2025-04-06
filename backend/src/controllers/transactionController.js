// backend/src/controllers/transactionController.js
const transactionService = require('../services/transactionService');

exports.initiateTransaction = async (req, res, next) => {
    try {
      // Expecting receiverNovaTag and amount from the request body.
      const { receiverNovaTag, amount } = req.body;
      if (!receiverNovaTag || !amount) {
        return res.status(400).json({ error: "receiverNovaTag and amount are required." });
      }
      
      // Retrieve the sender's NovaTag from the authentication middleware.
      const senderNovaTag = req.user && req.user.nova_tag;
      if (!senderNovaTag) {
        return res.status(400).json({ error: "Sender NovaTag is not set. Please update your NovaTag." });
      }
      console.log("Sender NovaTag from req.user:", senderNovaTag);

  
      const transaction = await transactionService.initiateTransaction(senderNovaTag, receiverNovaTag, amount);
      return res.status(201).json({ message: "Transaction completed successfully.", transaction });
    } catch (error) {
      next(error);
    }
  };

exports.getTransactionHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const transactions = await transactionService.getTransactionHistory(userId);
    return res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};
