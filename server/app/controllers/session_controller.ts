import type { HttpContext } from '@adonisjs/core/http'
import SessionService from '#services/session_service'
import { handleError } from '#exceptions/handle_error'

const sessionService = new SessionService()

export default class SessionController {

  async createSolo({ request, response }: HttpContext) {
    try {
      const user = request.user!
      const { quizId } = request.only(['quizId'])

      const session = await sessionService.createSoloSession(
        user.id,
        Number(quizId)
      )

      return response.created({
        sessionId: session.id,
      })
    } catch (error) {
      return handleError(error, response)
    }
  }

  async getQuestion({ request, params, response }: HttpContext) {
    try {
      const user = request.user!

      const data = await sessionService.getCurrentQuestion(
        user.id,
        Number(params.id)
      )

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async submitAnswer({ request, params, response }: HttpContext) {
    try {
      const user = request.user!
      const { selectedOption } = request.only(['selectedOption'])

      const data = await sessionService.submitAnswer(
        user.id,
        Number(params.id),
        selectedOption
      )

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async getResult({ request, params, response }: HttpContext) {
    try {
      const user = request.user!

      const data = await sessionService.getResult(
        user.id,
        Number(params.id)
      )

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }
}