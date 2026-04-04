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

  @column()
  declare currentQuestionIndex: number

  @column()
  declare startTime: string

  @column()
  declare endTime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}