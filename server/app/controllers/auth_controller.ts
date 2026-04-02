import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import Hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '#services/jwt_service'

export default class AuthController {

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const existing = await User.findBy('email', payload.email)
    if (existing) {
      return response.badRequest({ error: 'Email already in use' })
    }

    const user = await User.create(payload)

    const accessToken = generateAccessToken({ id: user.id })
    const refreshToken = generateRefreshToken({ id: user.id })

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    })

    return response.created({ user, accessToken, refreshToken })
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const user = await User.findBy('email', payload.email)
    if (!user) return response.unauthorized({ error: 'Invalid credentials' })

    const isValid = await Hash.verify(user.password, payload.password)
    if (!isValid) return response.unauthorized({ error: 'Invalid credentials' })

    const accessToken = generateAccessToken({ id: user.id })
    const refreshToken = generateRefreshToken({ id: user.id })

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    })

    return response.ok({ user, accessToken, refreshToken })
  }

  async refresh({ request, response }: HttpContext) {
    const { refreshToken } = request.only(['refreshToken'])

    if (!refreshToken) {
      return response.unauthorized({ error: 'No refresh token' })
    }

    try {
      const decoded: any = verifyRefreshToken(refreshToken)

      const tokenExists = await RefreshToken.findBy('token', refreshToken)
      if (!tokenExists) {
        return response.unauthorized({ error: 'Invalid refresh token' })
      }

      const accessToken = generateAccessToken({ id: decoded.id })

      return response.ok({ accessToken })
    } catch {
      return response.unauthorized({ error: 'Invalid or expired refresh token' })
    }
  }

  async logout({ request, response }: HttpContext) {
    const { refreshToken } = request.only(['refreshToken'])

    if (refreshToken) {
      await RefreshToken.query().where('token', refreshToken).delete()
    }

    return response.ok({ message: 'Logged out' })
  }

  async me({ request, response }: HttpContext) {
  const user = (request as any).user

  if (!user) {
    return response.unauthorized({ error: 'Unauthorized' })
  }

  return response.ok(user)
}
}