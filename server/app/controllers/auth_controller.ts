import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import AuthService from '#services/auth_service'
import { handleError } from '#exceptions/handle_error'
import { unlink } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'

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
      profilePictureUrl: user.profilePictureUrl,
    })
  }

  async updateProfile({ request, response }: HttpContext) {
    const user = request.user

    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    const { name } = request.only(['name'])

    if (name) {
      user.name = name.trim()
    }

    await user.save()

    return response.ok({
      message: 'Profile updated',
      user,
    })
  }

  async uploadAvatar({ request, response }: HttpContext) {
    const user = request.user

    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!avatar) {
      return response.badRequest({ error: 'No file uploaded' })
    }

    const fileName = `${Date.now()}.${avatar.extname}`

    await avatar.move(app.makePath('tmp/uploads/avatars'), {
      name: fileName,
    })

    if (!avatar.isValid) {
      return response.badRequest({ error: avatar.errors })
    }

    if (user.profilePictureUrl?.startsWith('/uploads')) {
      try {
        const oldPath = app.makePath(
          'tmp/uploads',
          ...user.profilePictureUrl.replace('/uploads/', '').split('/')
        )
        await unlink(oldPath)
      } catch { }
    }

    user.profilePictureUrl = `/uploads/avatars/${fileName}`
    await user.save()

    return response.ok({
      message: 'Avatar updated',
      avatar: user.profilePictureUrl,
    })
  }
}