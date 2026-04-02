// import type { HttpContext } from '@adonisjs/core/http'

import QuizService from "#services/quiz_service"


const quizService = new QuizService()
export default class QuizzesController {

    async index() {
        return quizService.getAll()
    }

    async getById({ params }: { params: { id: string } }) {
        return quizService.getById(Number(params.id))
    }
}