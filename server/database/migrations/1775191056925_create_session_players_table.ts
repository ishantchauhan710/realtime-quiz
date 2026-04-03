import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'session_players'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('session_id')
        .unsigned()
        .references('id')
        .inTable('sessions')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')

      table.integer('score').defaultTo(0)
      table.integer('current_question_index').defaultTo(0)

      table.boolean('is_finished').defaultTo(false)
      table.timestamp('finished_at').nullable()

      table.timestamp('joined_at')

      table.index(['session_id'])
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}