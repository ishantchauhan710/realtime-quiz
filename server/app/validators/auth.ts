// app/validators/auth_validator.ts
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(50),
    email: vine.string().email(),
    password: vine.string().minLength(6).maxLength(100),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)