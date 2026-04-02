import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('quiz_id').unsigned().notNullable()

      table
        .enum('mode', ['solo', 'multiplayer'])
        .notNullable()

      table
        .enum('status', ['waiting', 'active', 'finished'])
        .defaultTo('waiting')

      table.timestamp('start_time').nullable()
      table.timestamp('end_time').nullable()

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}