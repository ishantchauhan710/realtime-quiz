import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quizId: number

  @column()
  declare questionText: string

  @column()
  declare options: string[]

  @column()
  declare correctOption: number

  @column()
  declare orderIndex: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}