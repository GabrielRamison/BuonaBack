// migrations/YYYYMMDDHHMMSS_initial_schema.js
exports.up = function(knex) {
  return knex.schema
    // Tabela de Usuários
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('phone');
      table.enum('role', ['admin', 'winery_owner', 'customer']).defaultTo('customer');
      table.string('profile_image');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })

    // Tabela de Vinícolas
    .createTable('wineries', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('address').notNullable();
      table.string('city').notNullable();
      table.string('state').notNullable();
      table.string('postal_code');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.string('phone');
      table.string('email');
      table.string('website');
      table.json('business_hours');
      table.string('logo_url');
      table.string('cover_image_url');
      table.integer('owner_id').unsigned();
      table.foreign('owner_id').references('users.id').onDelete('SET NULL');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })

    // Tabela de Vinhos
    .createTable('wines', function(table) {
      table.increments('id').primary();
      table.integer('winery_id').unsigned().notNullable();
      table.foreign('winery_id').references('wineries.id').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('description');
      table.enum('type', ['red', 'white', 'rose', 'sparkling', 'dessert']).notNullable();
      table.integer('year').notNullable();
      table.decimal('alcohol_content', 4, 2);
      table.string('grape_variety');
      table.string('region');
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock_quantity').defaultTo(0);
      table.string('serving_temperature');
      table.json('images');
      table.decimal('rating', 2, 1);
      table.integer('ratings_count').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })

    // Tabela de Avaliações
    .createTable('ratings', function(table) {
      table.increments('id').primary();
      table.integer('wine_id').unsigned().notNullable();
      table.foreign('wine_id').references('wines.id').onDelete('CASCADE');
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.integer('rating').notNullable();
      table.text('comment');
      table.timestamps(true, true);
    })

    // Tabela de Eventos
    .createTable('events', function(table) {
      table.increments('id').primary();
      table.integer('winery_id').unsigned().notNullable();
      table.foreign('winery_id').references('wineries.id').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('description');
      table.datetime('start_date').notNullable();
      table.datetime('end_date');
      table.string('image_url');
      table.decimal('price', 10, 2);
      table.integer('capacity');
      table.json('additional_info');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })

    // Tabela de Agendamentos
    .createTable('bookings', function(table) {
      table.increments('id').primary();
      table.integer('winery_id').unsigned().notNullable();
      table.foreign('winery_id').references('wineries.id').onDelete('CASCADE');
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.date('visit_date').notNullable();
      table.time('visit_time').notNullable();
      table.integer('number_of_people').notNullable();
      table.boolean('colonial_breakfast').defaultTo(false);
      table.enum('status', ['pending', 'confirmed', 'cancelled']).defaultTo('pending');
      table.text('notes');
      table.timestamps(true, true);
    })

    // Tabela de Mensagens
    .createTable('messages', function(table) {
      table.increments('id').primary();
      table.integer('sender_id').unsigned().notNullable();
      table.foreign('sender_id').references('users.id').onDelete('CASCADE');
      table.integer('receiver_id').unsigned().notNullable();
      table.foreign('receiver_id').references('users.id').onDelete('CASCADE');
      table.text('content').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamp('read_at');
      table.timestamps(true, true);
    })

    // Tabela de Carrinho
    .createTable('cart_items', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.integer('wine_id').unsigned().notNullable();
      table.foreign('wine_id').references('wines.id').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.timestamps(true, true);
    })

    // Tabela de Pedidos
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.decimal('total_amount', 10, 2).notNullable();
      table.enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
        .defaultTo('pending');
      table.json('shipping_address');
      table.json('payment_info');
      table.timestamps(true, true);
    })

    // Tabela de Itens do Pedido
    .createTable('order_items', function(table) {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNullable();
      table.foreign('order_id').references('orders.id').onDelete('CASCADE');
      table.integer('wine_id').unsigned().notNullable();
      table.foreign('wine_id').references('wines.id').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('cart_items')
    .dropTableIfExists('messages')
    .dropTableIfExists('bookings')
    .dropTableIfExists('events')
    .dropTableIfExists('ratings')
    .dropTableIfExists('wines')
    .dropTableIfExists('wineries')
    .dropTableIfExists('users');
};