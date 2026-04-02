import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SessionPlayer from './session_player.ts'

export default class QuestionProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionPlayerId: number

  @column()
  declare questionId: number

  @column()
  declare selectedOption: string | null

  @column()
  declare isCorrect: boolean

  @column.dateTime()
  declare answeredAt: DateTime

  @column()
  declare timeTaken: number

  @belongsTo(() => SessionPlayer)
  declare player: BelongsTo<typeof SessionPlayer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}