// backend/src/controllers/userController.js
const db = require('../utils/db');

exports.getUserBalance = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Retrieve the user by ID from the database.
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user's balance.
    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    next(error);
  }
};

exports.updateNovaTag = async (req, res, next) => {
    try {
      // Use the logged-in user's ID from the authentication middleware.
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized." });
      }
  
      const { nova_tag } = req.body;
      if (!nova_tag || nova_tag[0] !== '$') {
        return res.status(400).json({ error: "Invalid NovaTag. It must start with '$'." });
      }
  
      // Check if the nova_tag is already in use by another user.
      const existingTagUser = await db('users')
        .where('nova_tag', nova_tag)
        .andWhereNot('id', userId)
        .first();
      if (existingTagUser) {
        return res.status(400).json({ error: "NovaTag already in use." });
      }
  
      // Retrieve current user to check if nova_tag is already set.
      const currentUser = await db('users').where('id', userId).first();
      let message = "";
      if (!currentUser.nova_tag) {
        message = "NovaTag Created.";
      } else {
        message = "NovaTag Updated.";
      }
  
      const [updatedUser] = await db('users')
        .where('id', userId)
        .update({
          nova_tag: nova_tag,
          updated_at: new Date()
        })
        .returning('*');
  
      return res.status(200).json({ message, user: updatedUser });
    } catch (error) {
      next(error);
    }
  };