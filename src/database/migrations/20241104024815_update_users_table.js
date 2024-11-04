// src/database/migrations/20241104024815_update_users_table.js
exports.up = function(knex) {
    return knex.schema.alterTable('users', table => {
      // Modifica o enum diretamente na coluna role
      table.enum('role', ['admin', 'winery', 'customer'])
        .alter()
        .defaultTo('customer');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', table => {
      // Reverte para os valores originais
      table.enum('role', ['admin', 'winery_owner', 'customer'])
        .alter()
        .defaultTo('customer');
    });
  };