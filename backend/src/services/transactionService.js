// backend/src/services/transactionService.js
const db = require('../utils/db');

// Helper: Get a user by their NovaTag.
async function getUserByNovaTag(novaTag) {
  if (!novaTag || novaTag[0] !== '$') {
    throw new Error("Invalid NovaTag. It must start with '$'.");
  }
  return db('users').where('nova_tag', novaTag).first();
}

exports.initiateTransaction = async (senderNovaTag, receiverNovaTag, amount) => {
  // Convert amount to a number and validate.
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  // Retrieve sender and receiver by their NovaTags.
  const sender = await getUserByNovaTag(senderNovaTag);
  if (!sender) {
    throw new Error("Sender not found.");
  }

  const receiver = await getUserByNovaTag(receiverNovaTag);
  if (!receiver) {
    throw new Error("Receiver not found.");
  }

  // Check if sender has enough balance.
  if (parseFloat(sender.balance) < amount) {
    throw new Error("Insufficient balance.");
  }

  // Use a Knex transaction for atomicity.
  return db.transaction(async (trx) => {
    // Deduct amount from sender.
    await trx('users')
      .where('nova_tag', sender)
      .update({
        balance: parseFloat(sender.balance) - amount,
        updated_at: new Date()
      });

    // Add amount to receiver.
    await trx('users')
      .where('nova_tag', receiver)
      .update({
        balance: parseFloat(receiver.balance) + amount,
        updated_at: new Date()
      });

    // Record the transaction.
    const [transaction] = await trx('transactions')
      .insert({
        senderNovaTag: sender.nova_tag,
        receiverNovaTag: receiver.nova_tag,
        amount: amount,
        // transaction_type: 'peer-to-peer'
      })
      .returning('*');

    return transaction;
  });
};

exports.getTransactionHistory = async (novaTag) => {
  return db('transactions')
    .where('senderNovaTag', novaTag)
    .orWhere('receiverNovaTag', novaTag)
    .orderBy('created_at', 'desc');
};
