import Session from '#models/session'
import SessionPlayer from '#models/session_player'
import Quiz from '#models/quiz'
import QuestionProgress from '#models/question_progress'
import { DateTime } from 'luxon'

export default class SessionService {

  static async createSoloSession(userId: number, quizId: number) {

    const session = await Session.create({
      quizId,
      mode: 'solo',
      status: 'active',
      startTime: DateTime.now()
    })

    const player = await SessionPlayer.create({
      sessionId: session.id,
      userId
    })

    const quiz = await Quiz.findOrFail(quizId)

    await quiz.load('questions', (q) => {
      q.preload('options')
    })

    return {
      sessionId: session.id,
      playerId: player.id,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options.map(o => ({
          id: o.id,
          text: o.text
        }))
      }))
    }
  }

  static async submitAnswer(
    userId: number,
    sessionId: number,
    answer: string | null
  ) {
    const player = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .where('user_id', userId)
      .firstOrFail()

    const session = await Session.findOrFail(sessionId)

    const quiz = await Quiz.findOrFail(session.quizId)

    await quiz.load('questions', (q) => {
      q.preload('options')
    })

    const question = quiz.questions[player.currentQuestionIndex]

    if (!question) {
      return { message: 'Quiz already finished' }
    }

    let selectedOption = null
    let isCorrect = false

    if (answer) {
      selectedOption =
        question.options.find((o) => o.text === answer) || null

      isCorrect = selectedOption?.isCorrect || false

      if (isCorrect) player.score += 10
    }

    await QuestionProgress.create({
      sessionPlayerId: player.id,
      questionId: question.id,
      selectedOption: answer ?? null,
      isCorrect,
      answeredAt: DateTime.now(),
      timeTaken: 0
    })

    player.currentQuestionIndex += 1

    const isFinished =
      player.currentQuestionIndex >= quiz.questions.length

    if (isFinished) {
      player.finishedAt = DateTime.now()
      session.status = 'finished'
      session.endTime = DateTime.now()
      await session.save()
    }

    await player.save()

    return {
      correct: isCorrect,
      score: player.score,
      nextQuestionIndex: player.currentQuestionIndex,
      finished: isFinished
    }
  }

}