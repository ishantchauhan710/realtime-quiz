import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Quiz from './quiz.ts'
import Option from './option.ts'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'quiz_id' })
  declare quizId: number

  @column()
  declare question: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Quiz)
  declare quiz: BelongsTo<typeof Quiz>

  @hasMany(() => Option)
  declare options: HasMany<typeof Option>
}