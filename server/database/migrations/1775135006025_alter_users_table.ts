import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profile_picture_url').nullable()
      table.enum('authentication_type', ['email', 'google']).defaultTo('email')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('profile_picture_url')
      table.dropColumn('authentication_type')
    })
  }
}