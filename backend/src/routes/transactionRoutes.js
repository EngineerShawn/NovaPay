// backend/src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the dummy auth middleware
const transactionController = require('../controllers/transactionController');

// Endpoint to initiate a new transaction.
router.post('/', authMiddleware, transactionController.initiateTransaction);

// Endpoint to get transaction history for a user.
router.get('/:userId', transactionController.getTransactionHistory);

module.exports = router;
