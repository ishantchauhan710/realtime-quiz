import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SessionPlayer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionId: number

  @column()
  declare userId: number

  @column()
  declare score: number

  @column()
  declare currentQuestionIndex: number

  @column()
  declare isFinished: boolean

  @column.dateTime()
  declare finishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare joinedAt: DateTime
}