import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('quiz_id')
        .unsigned()
        .references('id')
        .inTable('quizzes')
        .onDelete('CASCADE')

      table.text('question_text').notNullable()
      table.jsonb('options').notNullable()
      table.integer('correct_option').notNullable()
      table.integer('order_index').notNullable()

      table.timestamp('created_at')

      table.index(['quiz_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}