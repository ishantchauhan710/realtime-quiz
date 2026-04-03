import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PlayerAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionPlayerId: number

  @column()
  declare questionId: number

  @column()
  declare selectedOption: number

  @column()
  declare isCorrect: boolean

  @column()
  declare timeTaken: number | null

  @column.dateTime({ autoCreate: true })
  declare answeredAt: DateTime
}