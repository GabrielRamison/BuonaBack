exports.up = function(knex) {
    return knex.schema
      .createTable('chat_messages', function(table) {
        table.increments('id').primary();
        table.integer('winery_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.text('content').notNullable();
        table.boolean('is_read').defaultTo(false);
        table.timestamp('read_at').nullable();
        table.timestamps(true, true);
        
        table.foreign('winery_id').references('wineries.id');
        table.foreign('user_id').references('users.id');
      })
      .createTable('chat_participants', function(table) {
        table.increments('id').primary();
        table.integer('winery_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('last_read_at').nullable();
        table.timestamps(true, true);
  
        table.foreign('winery_id').references('wineries.id');
        table.foreign('user_id').references('users.id');
        table.unique(['winery_id', 'user_id']);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('chat_messages')
      .dropTableIfExists('chat_participants');
  };