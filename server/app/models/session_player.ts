import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Session from './session.ts'
import QuestionProgress from './question_progress.ts'
import User from './user.ts'

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

  @column.dateTime()
  declare finishedAt: DateTime | null

  @belongsTo(() => Session)
  declare session: BelongsTo<typeof Session>

  @hasMany(() => QuestionProgress)
  declare progress: HasMany<typeof QuestionProgress>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}