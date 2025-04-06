// backend/src/controllers/authController.js
const authService = require('../services/authService');
const verificationService = require('../services/verificationService');
const db = require('../utils/db');

exports.confirmCode = async (req, res, next) => {
  try {
    const { contact, code } = req.body;
    if (!contact || !code) {
      return res.status(400).json({ error: "Contact and verification code are required." });
    }

    // Await the verification of the code using the updated verification service.
    const isValid = await verificationService.verifyCode(contact, code);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    // Check if a user already exists with this contact.
    const user = await db('users')
      .where(function () {
        this.where('phone', contact).orWhere('email', contact);
      })
      .first();

    if (user) {
      // Account exists; instruct the client to prompt for the 4-digit pin.
      return res.status(200).json({
        message: "Verification successful. Account exists. Please enter your 4-digit pin to login.",
        accountExists: true,
        user: { id: user.id, name: `${user.first_name} ${user.last_name || ''}`.trim() }
      });
    } else {
      // No account exists; automatically direct the user to the registration screen.
      return res.status(200).json({ accountExists: false });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyContact = async (req, res, next) => {
  try {
    const { contact } = req.body; // Expect phone number or email.
    // Call your service to send a verification code via SMS or email.
    const result = await authService.sendVerificationCode(contact);
    return res.status(200).json({ message: 'Verification code sent.', data: result });
  } catch (error) {
    next(error);
  }
};

exports.confirmCode = async (req, res, next) => {
  try {
    const { contact, code } = req.body;
    if (!contact || !code) {
      return res.status(400).json({ error: "Contact and Verification Code are Required."});
  }

      // Verify the code using the verification service.
      const isValid = verificationService.verifyCode(contact, code);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code." });
      }
  
      // Check if a user already exists with this contact.
      const user = await db('users')
        .where(function () {
          this.where('phone', contact).orWhere('email', contact);
        })
        .first();
  
      if (user) {
        // Account exists; instruct the client to prompt for the pin.
        return res.status(200).json({
          message: "Enter your account pin.",
          accountExists: true,
          user: { id: user.id, name: user.name }
        });
      } else {
        // No account exists; instruct the client to proceed with registration.
        return res.status(200).json({ accountExists: false });
      }
    } catch (error) {
      next(error);
    }
  };

exports.registerUser = async (req, res, next) => {
  try {
    const userData = req.body;
    // Validate verification code and register the user.
    const newUser = await authService.registerUser(userData);
    return res.status(201).json({ message: 'Registration Complete!', user: newUser });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { contact, pin } = req.body;
    //Validate the "pin" input
    if (!pin) {
      return res.status(400).json({ error: "Please input a 4-digit pin"});
    }
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "Pin must be 4 digits" });
    }

    // Authenticate user using the provided pin
    const user = await authService.loginUser(contact, pin);
    return res.status(200).json({ message: `Welcome back, ${user.first_name}!`, user });
  } catch (error) {
    // Handle known errors with appropriate status codes
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.message === 'Invalid PIN') {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    next(error);
  }
};
