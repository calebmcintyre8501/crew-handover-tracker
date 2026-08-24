exports.up = function (knex) {
  return knex.schema.createTable('updates', (table) => {
    table.increments('id').primary()

    table
      .integer('handover_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('handovers')
      .onDelete('CASCADE')

    table
      .integer('personnel_id')
      .unsigned()
      .references('id')
      .inTable('personnel')
      .onDelete('SET NULL')

    table.text('message').notNullable()

    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('updates')
}