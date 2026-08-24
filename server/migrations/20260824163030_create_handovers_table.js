exports.up = function (knex) {
  return knex.schema.createTable('handovers', (table) => {
    table.increments('id').primary()

    table.string('title').notNullable()
    table.text('description').notNullable()

    table.string('category').notNullable()
    table.string('priority').notNullable().defaultTo('normal')
    table.string('status').notNullable().defaultTo('open')

    table
      .integer('created_by')
      .unsigned()
      .references('id')
      .inTable('personnel')
      .onDelete('SET NULL')

    table
      .integer('attention_for')
      .unsigned()
      .references('id')
      .inTable('personnel')
      .onDelete('SET NULL')

    table.date('due_date')

    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('handovers')
}