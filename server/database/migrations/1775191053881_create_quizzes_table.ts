import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quizzes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.text('description').nullable()

      table.integer('total_questions').notNullable()
      table.integer('time_per_question').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.boolean('is_default').defaultTo(true)

      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}