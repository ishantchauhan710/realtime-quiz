import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Quiz extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare totalQuestions: number

  @column()
  declare timePerQuestion: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}