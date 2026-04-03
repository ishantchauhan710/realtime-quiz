import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'player_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('session_player_id')
        .unsigned()
        .references('id')
        .inTable('session_players')
        .onDelete('CASCADE')

      table
        .integer('question_id')
        .unsigned()
        .references('id')
        .inTable('questions')

      table.integer('selected_option').notNullable()
      table.boolean('is_correct').notNullable()
      table.integer('time_taken').nullable()

      table.timestamp('answered_at')

      table.index(['session_player_id'])
      table.index(['question_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}