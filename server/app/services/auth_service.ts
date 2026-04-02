import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import Hash from '@adonisjs/core/services/hash'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '#services/jwt_service'
import AppError from '#exceptions/app_error'
import { unlink } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

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

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    const isValid = await Hash.verify(user.password, payload.password)

    if (!isValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

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
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH')
    }

    const accessToken = generateAccessToken({ id: decoded.id })

    return { accessToken }
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await RefreshToken.query().where('token', refreshToken).delete()
    }
  }

  async updateProfile(user: User, payload: { name?: string }) {
    if (payload.name) {
      user.name = payload.name.trim()
    }

    await user.save()

    return {
      message: 'Profile updated',
      user,
    }
  }

  async uploadAvatar(user: User, avatar: MultipartFile) {
    if (!avatar.isValid) {
      throw new AppError('Invalid file', 400, 'INVALID_FILE')
    }

    const fileName = `${Date.now()}.${avatar.extname}`
    const uploadPath = app.makePath('tmp/uploads/avatars')

    await avatar.move(uploadPath, { name: fileName })

    if (user.profilePictureUrl?.startsWith('/uploads')) {
      try {
        const oldPath = app.makePath(
          'tmp/uploads',
          ...user.profilePictureUrl.replace('/uploads/', '').split('/')
        )
        await unlink(oldPath)
      } catch {}
    }

    user.profilePictureUrl = `/uploads/avatars/${fileName}`
    await user.save()

    return {
      message: 'Avatar updated',
      avatar: user.profilePictureUrl,
    }
  }
}