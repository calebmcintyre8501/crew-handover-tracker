exports.up = function (knex) {
  return knex.schema.createTable('personnel', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('rank')
    table.string('role')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('personnel')
}