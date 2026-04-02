import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Question from './question.ts'

export default class Option extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'question_id' })
  declare questionId: number

  @column()
  declare text: string

  @column({ columnName: 'is_correct' })
  declare isCorrect: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Question)
  declare question: BelongsTo<typeof Question>
}