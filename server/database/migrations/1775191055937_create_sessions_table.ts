import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('quiz_id')
        .unsigned()
        .references('id')
        .inTable('quizzes')

      table.enum('status', ['waiting', 'active', 'finished'])
        .defaultTo('waiting')

      table.enum('mode', ['solo', 'multiplayer']).notNullable()

      table.string('join_code').unique().nullable()

      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')

      table.timestamp('start_time').nullable()
      table.timestamp('end_time').nullable()

      table.integer('current_question_index').defaultTo(0)

      table.timestamp('created_at')

      table.index(['status'])
      table.index(['quiz_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}