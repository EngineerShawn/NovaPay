// backend/src/services/authService.js
const db = require('../utils/db');
const bcrypt = require('bcrypt'); // For hashing the pin if needed
const verificationService = require('./verificationService'); // Assuming you have a verification service

// This is a sample function. In a production system, you would integrate an SMS/email API.
exports.sendVerificationCode = async (contact) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  // Store the code in the JSON file for development.
  await verificationService.storeCode(contact, code);
  // In production, integrate an SMS/Email service to send the code.
  console.log(`Sending verification code ${code} to ${contact}`);
  return { contact, code };
};

exports.registerUser = async (userData) => {
  // Validate the verification code before proceeding (this is a placeholder)
  // Hash the 4-digit pin
  const saltRounds = 10;
  const hashedPin = await bcrypt.hash(userData.pin, saltRounds);

  // Insert the new user into the database
  const [newUser] = await db('users')
    .insert({
      first_name: userData.first_name,
      last_name: userData.last_name || null,
      phone: userData.phone || null,
      email: userData.email || null,
      pin: hashedPin,
      dob: userData.dob || null,
      address: userData.address || null,
      city: userData.city || null,
      state: userData.state || null,
      zip_code: userData.zip_code || null,
      balance: userData.balance || 0,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return newUser;
};

exports.loginUser = async (contact, pin) => {
  // Look up user by phone or email
  const user = await db('users')
    .where(function () {
      this.where('phone', contact).orWhere('email', contact);
    })
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  // Compare the stored hashed pin with the provided pin
  const isMatch = await bcrypt.compare(pin, user.pin);
  if (!isMatch) {
    throw new Error('Invalid PIN');
  }

  return user;
};
