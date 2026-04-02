import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import AuthService from '#services/auth_service'
import { generateAccessToken, generateRefreshToken } from '#services/jwt_service'
import RefreshToken from '#models/refresh_token'

const authService = new AuthService()

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

        let user = await User.findBy('email', userData.email)

        if (!user) {
            user = await User.create({
                email: userData.email,
                name: userData.name,
                password: 'google_auth',
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