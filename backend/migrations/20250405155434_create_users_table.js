// backend/migrations/20250405_create_users_table.js
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('phone').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('pin').notNullable();
      table.string('dob').notNullable();
      table.string('address');
      table.string('city');
      table.string('state');
      table.string('zip_code');
      table.string('nova_tag').unique();
      table.decimal('balance', 10, 2).defaultTo(0);
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  