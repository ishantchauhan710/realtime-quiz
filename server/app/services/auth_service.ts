import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import Hash from '@adonisjs/core/services/hash'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '#services/jwt_service'
import AppError from '#exceptions/app_error'

export default class AuthService {

  async register(payload: any) {
    const existing = await User.findBy('email', payload.email)
    if (existing) {
      throw new AppError('Email already in use', 400, 'EMAIL_EXISTS')
    }

    const user = await User.create(payload)

    const accessToken = generateAccessToken({ id: user.id })
    const refreshToken = generateRefreshToken({ id: user.id })

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    })

    return { user, accessToken, refreshToken }
  }

  async login(payload: any) {
    const user = await User.findBy('email', payload.email)
    if (!user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')

    const isValid = await Hash.verify(user.password, payload.password)
    if (!isValid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')

    const accessToken = generateAccessToken({ id: user.id })
    const refreshToken = generateRefreshToken({ id: user.id })

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    })

    return { user, accessToken, refreshToken }
  }

  async refresh(refreshToken: string) {
    const decoded: any = verifyRefreshToken(refreshToken)

    const tokenExists = await RefreshToken.findBy('token', refreshToken)
    if (!tokenExists) {
      throw new Error('INVALID_REFRESH')
    }

    const accessToken = generateAccessToken({ id: decoded.id })

    return { accessToken }
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await RefreshToken.query().where('token', refreshToken).delete()
    }
  }
}