import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'
import { errors as vineErrors } from '@vinejs/vine'

export default class AuthController {

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      const existing = await User.findBy('email', payload.email)
      if (existing) {
        return response.badRequest({ error: 'Email already in use' })
      }

      const user = await User.create(payload)

      return response.created({
        message: 'User created',
        user,
      })
    } catch (error) {
      if (error instanceof vineErrors.E_VALIDATION_ERROR) {
        console.error('Validation error:', error.messages)
        return response.badRequest({
          error: error.messages[0]?.message || 'Validation failed',
          fields: error.messages,
        })
      }

      return response.internalServerError({ error: 'Something went wrong' })
    }
  }

  async login({ request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)

      const user = await User.findBy('email', payload.email)
      if (!user) {
        return response.unauthorized({ error: 'Invalid credentials' })
      }

      const isValid = await Hash.verify(user.password, payload.password)
      if (!isValid) {
        return response.unauthorized({ error: 'Invalid credentials' })
      }

      const token = await auth.use('api').createToken(user)

      return response.ok({
        message: 'Login successful',
        user,
        token,
      })
    } catch (error) {
      if (error instanceof vineErrors.E_VALIDATION_ERROR) {
        return response.badRequest({
          error: 'Validation failed',
          fields: error.messages,
        })
      }

      return response.internalServerError({ error: 'Something went wrong' })
    }
  }

  async me({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    return response.ok(auth.user)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.ok({
      message: 'Logged out',
    })
  }
}