import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import AuthService from '#services/auth_service'
import { handleError } from '#exceptions/handle_error'

const authService = new AuthService()

export default class AuthController {

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const data = await authService.register(payload)
      return response.created(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)
      const data = await authService.login(payload)
      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async refresh({ request, response }: HttpContext) {
    try {
      const { refreshToken } = request.only(['refreshToken'])
      const data = await authService.refresh(refreshToken)
      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async logout({ request, response }: HttpContext) {
    try {
      const { refreshToken } = request.only(['refreshToken'])
      await authService.logout(refreshToken)
      return response.ok({ message: 'Logged out' })
    } catch (error) {
      return handleError(error, response)
    }
  }

  async me({ request, response }: HttpContext) {
    const user = request.user

    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    return response.ok({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  }
}