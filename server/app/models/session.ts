import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quizId: number

  @column()
  declare status: 'waiting' | 'active' | 'finished'

  @column()
  declare mode: 'solo' | 'multiplayer'

  @column()
  declare joinCode: string | null

  @column()
  declare createdBy: number

  // @column()
  // declare currentQuestionIndex: number

  @column.dateTime()
  declare startTime: DateTime | null

  @column.dateTime()
  declare endTime: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}