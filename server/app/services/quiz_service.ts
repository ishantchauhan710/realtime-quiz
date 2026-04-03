import Quiz from '#models/quiz'
import Question from '#models/question'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateQuizInput, CreateQuestionInput, UpdateQuizInput } from '../types/quiz.ts'

export default class QuizService {

  async getAllQuizzes(userId?: number) {
    return await Quiz.query()
      .where((query) => {
        query.where('is_default', true)

        if (userId) {
          query.orWhere('created_by', userId)
        }
      })
      .select(
        'id',
        'title',
        'description',
        'total_questions',
        'time_per_question',
        'is_default'
      )
  }

  async getQuizWithQuestions(quizId: number) {
    return await Quiz.query()
      .where('id', quizId)
      .preload('questions', (query) => {
        query.orderBy('order_index', 'asc')
      })
      .firstOrFail()
  }

  async createQuiz(userId: number, payload: CreateQuizInput) {
    const quiz = await Quiz.create({
      title: payload.title,
      description: payload.description ?? null,
      totalQuestions: payload.questions.length,
      timePerQuestion: payload.timePerQuestion,
      isDefault: false,
      createdBy: userId,
    })

    const questions = payload.questions.map(
      (q: CreateQuestionInput, index: number) => ({
        quizId: quiz.id,
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
        orderIndex: index,
      })
    )

    await Question.createMany(questions)

    return quiz
  }

  async updateQuiz(
    userId: number,
    quizId: number,
    payload: UpdateQuizInput
  ) {
    const quiz = await Quiz.findOrFail(quizId)

    if (quiz.isDefault) {
      throw new Exception('Default quizzes cannot be edited', { status: 403 })
    }

    if (quiz.createdBy !== userId) {
      throw new Exception('Unauthorized', { status: 403 })
    }

    quiz.merge({
      title: payload.title ?? quiz.title,
      description: payload.description ?? quiz.description,
      timePerQuestion: payload.timePerQuestion ?? quiz.timePerQuestion,
    })

    await quiz.save()

    if (payload.questions) {
      const existingQuestions = await Question
        .query()
        .where('quiz_id', quizId)

      const existingMap = new Map(
        existingQuestions.map(q => [q.id, q])
      )

      const incomingIds = payload.questions
        .filter(q => q.id)
        .map(q => q.id)

      // Delete removed questions
      const toDelete = existingQuestions.filter(
        q => !incomingIds.includes(q.id)
      )

      for (const q of toDelete) {
        await q.delete()
      }

      // Upsert
      for (let i = 0; i < payload.questions.length; i++) {
        const q = payload.questions[i]

        if (q.id && existingMap.has(q.id)) {

          const existing = existingMap.get(q.id)!

          existing.merge({
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
            orderIndex: i,
          })

          await existing.save()
        } else {
          await Question.create({
            quizId: quizId,
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
            orderIndex: i,
          })
        }
      }

      quiz.totalQuestions = payload.questions.length
      await quiz.save()
    }

    return quiz
  }

  async deleteQuiz(userId: number, quizId: number) {
    const quiz = await Quiz.findOrFail(quizId)

    if (quiz.isDefault) {
      throw new Exception('Default quizzes cannot be deleted', { status: 403 })
    }

    if (quiz.createdBy !== userId) {
      throw new Exception('Unauthorized', { status: 403 })
    }

    await quiz.delete()

    return { message: 'Quiz deleted successfully' }
  }

  async getUserQuizzes(userId: number) {
    return await Quiz.query()
      .where('created_by', userId)
      .select(
        'id',
        'title',
        'description',
        'total_questions',
        'time_per_question',
        'is_default'
      )
      .orderBy('id', 'desc')
  }


}