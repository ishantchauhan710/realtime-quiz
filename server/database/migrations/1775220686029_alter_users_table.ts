import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('total_wins_solo').notNullable().defaultTo(0)
      table.integer('games_played_solo').notNullable().defaultTo(0)

      table.integer('total_wins_multi').notNullable().defaultTo(0)
      table.integer('games_played_multi').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('total_wins_solo')
      table.dropColumn('games_played_solo')

      table.dropColumn('total_wins_multi')
      table.dropColumn('games_played_multi')
    })
  }
}