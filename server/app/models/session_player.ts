import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { DateTime } from 'luxon'

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

  @column()
  declare finishedAt: DateTime | null

  @column()
  declare answeredAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}