// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the dummy auth middleware

// GET endpoint to retrieve a user's balance (this endpoint still uses userId as a parameter).
router.get('/:userId/balance', userController.getUserBalance);

// PUT endpoint to update a user's NovaTag; the userId is obtained from the auth middleware.
router.put('/nova-tag', authMiddleware, userController.updateNovaTag);

module.exports = router;
