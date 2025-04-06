/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (table) => {
      table.increments('id').primary();
      table.string('senderNovaTag').unsigned().notNullable(); // User IDs
      table.string('receiverNovaTag').unsigned().notNullable(); // Receiver User IDs
      table.decimal('amount', 10, 2).notNullable(); // Amount in dollars
      table.string('reason'); // e.g., 'payment', 'refund'
      table.string('transaction_type'); // e.g., 'peer-to-peer', 'bank-transfer'
      table.timestamp('created_at').defaultTo(knex.fn.now());
      // Foreign key constraints (optional)
      table.foreign('senderNovaTag').references('users.nova_tag')
      table.foreign('receiverNovaTag').references('users.nova_tag')
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
  };
