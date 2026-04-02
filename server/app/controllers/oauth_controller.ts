import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { generateAccessToken, generateRefreshToken } from '#services/jwt_service'
import RefreshToken from '#models/refresh_token'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class OauthController {

  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async callback({ ally, response }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.redirect('http://localhost:5173')
    }

    if (google.stateMisMatch()) {
      return response.badRequest('State mismatch')
    }

    if (google.hasError()) {
      return response.badRequest(google.getError())
    }

    const userData = await google.user()

    const email = userData.email.toLowerCase()

    let user = await User.findBy('email', email)

    let avatarPath: string | null = null

    if (userData.avatarUrl) {
      try {
        const res = await fetch(userData.avatarUrl)
        const buffer = await res.arrayBuffer()

        const fileName = `google_${Date.now()}.jpg`
        const uploadPath = path.join('tmp/uploads/avatars', fileName)

        await fs.mkdir('tmp/uploads/avatars', { recursive: true })
        await fs.writeFile(uploadPath, Buffer.from(buffer))

        avatarPath = `/uploads/avatars/${fileName}`
      } catch (err) {
        console.log('Avatar download failed:', err)
      }
    }

    if (!user) {
      user = await User.create({
        email,
        name: userData.name,
        password: '',
        profilePictureUrl: avatarPath,
        authenticationType: 'google',
      })
    }

    const accessToken = generateAccessToken({ id: user.id })
    const refreshToken = generateRefreshToken({ id: user.id })

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    })

    return response.redirect(
      `http://localhost:5173/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }
}