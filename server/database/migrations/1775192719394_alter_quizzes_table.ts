import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quizzes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
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
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}