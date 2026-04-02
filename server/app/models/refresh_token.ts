// app/models/refresh_token.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RefreshToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare token: string
}