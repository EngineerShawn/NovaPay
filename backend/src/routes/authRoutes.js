// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint to start registration/login by verifying phone or email.
router.post('/verify', authController.verifyContact);

// Endpoint to verify the 4-digit pin sent to the user's contact.
router.post('/confirm-code', authController.confirmCode);

// Endpoint to register a new user after verification.
router.post('/register', authController.registerUser);

// Endpoint for login (e.g., verify 4-digit pin)
router.post('/login', authController.loginUser);

// // Endpoint for the users account home page.
// router.get('/account_home', authController.accountHome);

module.exports = router;
