// backend/src/models/userModel.js
const db = require('../utils/db');

exports.findByContact = async (contact) => {
  return db('users')
    .where(function () {
      this.where('phone', contact).orWhere('email', contact);
    })
    .first();
};

// Additional model functions can be added here.
