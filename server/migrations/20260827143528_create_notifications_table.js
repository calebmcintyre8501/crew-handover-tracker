exports.up = function (knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary()

    table
      .integer('personnel_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('personnel')
      .onDelete('CASCADE')

    table
      .integer('handover_id')
      .unsigned()
      .references('id')
      .inTable('handovers')
      .onDelete('CASCADE')

    table.string('type').notNullable()
    table.string('title').notNullable()
    table.text('message').notNullable()

    table
      .boolean('is_read')
      .notNullable()
      .defaultTo(false)

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications')
}