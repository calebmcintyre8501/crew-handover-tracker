exports.up = function (knex) {
  return knex.schema.createTable('acknowledgments', (table) => {
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
      .notNullable()
      .references('id')
      .inTable('personnel')
      .onDelete('CASCADE')

    table.timestamp('acknowledged_at').defaultTo(knex.fn.now())

    table.unique(['handover_id', 'personnel_id'])
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('acknowledgments')
}