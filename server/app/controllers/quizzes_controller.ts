import type { HttpContext } from '@adonisjs/core/http'
import QuizService from '#services/quiz_service'
import {
  createQuizValidator,
  updateQuizValidator,
} from '#validators/quiz'

import { handleError } from '#exceptions/handle_error'

const quizService = new QuizService()

export default class QuizController {

  async index({ request, response }: HttpContext) {
    try {
      const user = request.user
      const data = await quizService.getAllQuizzes(user?.id)

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const data = await quizService.getQuizWithQuestions(Number(params.id))

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const user = request.user!
      const payload = await request.validateUsing(createQuizValidator)

      const data = await quizService.createQuiz(user.id, payload)

      return response.created(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async update({ request, params, response }: HttpContext) {
    try {
      const user = request.user!
      const payload = await request.validateUsing(updateQuizValidator)

      const data = await quizService.updateQuiz(
        user.id,
        Number(params.id),
        payload
      )

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }

  async destroy({ request, params, response }: HttpContext) {
    try {
      const user = request.user!

      const data = await quizService.deleteQuiz(
        user.id,
        Number(params.id)
      )

      return response.ok(data)
    } catch (error) {
      return handleError(error, response)
    }
  }
}