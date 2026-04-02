import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_progresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('session_player_id').notNullable()
      table.integer('question_id').notNullable()

      table.string('selected_option').nullable()
      table.boolean('is_correct').defaultTo(false)

      table.integer('time_taken').defaultTo(0)
      table.timestamp('answered_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}