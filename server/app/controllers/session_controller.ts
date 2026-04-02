import type { HttpContext } from '@adonisjs/core/http'
import SessionService from '#services/session_service'
import User from '#models/user'
import Session from '#models/session'

export default class SessionController {

    async createSolo({ request, response }: HttpContext) {
        const user = request.user as User

        const { quizId } = request.only(['quizId'])

        if (!quizId) {
            return response.badRequest({ message: 'quizId is required' })
        }

        const data = await SessionService.createSoloSession(
            user.id,
            quizId
        )

        return response.ok(data)
    }

    async answer({ request, params, response }: HttpContext) {
        const user = request.user as User

        const { answer } = request.only(['answer'])

        const data = await SessionService.submitAnswer(
            user.id,
            params.id,
            answer ?? null
        )

        return response.ok(data)
    }

    async createMultiplayer({ request, response }: HttpContext) {
        const user = request.user as User

        const { quizId } = request.only(['quizId'])

        if (!quizId) {
            return response.badRequest({ message: 'quizId is required' })
        }

        const data = await SessionService.createMultiplayerSession(
            user.id,
            quizId
        )

        return response.ok(data)
    }

    async joinMultiplayer({ params, response, auth }: HttpContext) {
        const user = auth.user as User
        const sessionId = params.id

        try {
            const player = await SessionService.joinMultiplayerSession(
                user.id,
                sessionId
            )

            return response.ok(player)
        } catch (error: Error | any) {
            return response.badRequest({ message: error.message })
        }
    }


}