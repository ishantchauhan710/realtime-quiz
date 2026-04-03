import Session from '#models/session'
import SessionPlayer from '#models/session_player'
import Quiz from '#models/quiz'
import Question from '#models/question'
import { DateTime } from 'luxon'

export default class SessionService {

  async createSoloSession(userId: number, quizId: number) {
    const quiz = await Quiz.findOrFail(quizId)

    const session = await Session.create({
      quizId: quiz.id,
      status: 'active',
      mode: 'solo',
      createdBy: userId,
      startTime: DateTime.now(),
    })

    await SessionPlayer.create({
      sessionId: session.id,
      userId,
      score: 0,
      currentQuestionIndex: 0,
      isFinished: false,
    })

    return session
  }

  async getCurrentQuestion(userId: number, sessionId: number) {
    const player = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .where('user_id', userId)
      .first()

    if (!player) {
      return { expired: true }
    }

    const session = await Session.findOrFail(sessionId)

    const question = await Question
      .query()
      .where('quiz_id', session.quizId)
      .orderBy('order_index')
      .offset(player.currentQuestionIndex)
      .first()

    if (!question) {
      return { finished: true }
    }

    if (player.isFinished) {
      return {
        expired: true,
        finished: true,
      }
    }

    return {
      finished: false,
      question,
      index: player.currentQuestionIndex,
    }
  }

  async submitAnswer(
    userId: number,
    sessionId: number,
    selectedOption: number
  ) {
    const player = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .where('user_id', userId)
      .firstOrFail()

    if (player.isFinished) {
      throw new Error('Session expired')
    }

    const session = await Session.findOrFail(sessionId)
    const quiz = await Quiz.findOrFail(session.quizId)

    const question = await Question
      .query()
      .where('quiz_id', session.quizId)
      .orderBy('order_index')
      .offset(player.currentQuestionIndex)
      .firstOrFail()

    const isCorrect = question.correctOption === selectedOption

    if (isCorrect) {
      player.score += 10
    }

    player.currentQuestionIndex += 1

    if (player.currentQuestionIndex >= quiz.totalQuestions) {
      player.isFinished = true
      player.finishedAt = DateTime.now()
    }

    await player.save()

    return {
      correct: isCorrect,
      correctOption: question.correctOption,
      score: player.score,
      finished: player.isFinished,
    }
  }

  async getResult(userId: number, sessionId: number) {
    const player = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .where('user_id', userId)
      .firstOrFail()

    if (!player.isFinished) {
      throw new Error('Session not finished yet')
    }

    return {
      score: player.score,
      finished: player.isFinished
    }
  }

  async createMultiplayerSession(userId: number, quizId: number) {
    const quiz = await Quiz.findOrFail(quizId)

    const session = await Session.create({
      quizId: quiz.id,
      mode: 'multiplayer',
      status: 'waiting',
      createdBy: userId,
    })

    await SessionPlayer.create({
      sessionId: session.id,
      userId,
      score: 0,
      currentQuestionIndex: 0,
      isFinished: false,
    })

    return session
  }

  async joinSession(userId: number, sessionId: number) {
    const session = await Session.findOrFail(sessionId)

    if (session.status !== 'waiting') {
      throw new Error('Game already started')
    }

    // prevent duplicate join
    const existing = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .where('user_id', userId)
      .first()

    if (existing) return session

    await SessionPlayer.create({
      sessionId,
      userId,
      score: 0,
      currentQuestionIndex: 0,
      isFinished: false,
    })

    return session
  }

  async getSessionState(sessionId: number) {
    const session = await Session.findOrFail(sessionId)

    const players = await SessionPlayer
      .query()
      .where('session_id', sessionId)
      .preload('user') 

    return {
      session,
      players,
    }
  }

  async startSession(userId: number, sessionId: number) {
    const session = await Session.findOrFail(sessionId)

    if (session.createdBy !== userId) {
      throw new Error('Only host can start')
    }

    if (session.status !== 'waiting') {
      throw new Error('Session already started')
    }

    const players = await SessionPlayer
      .query()
      .where('session_id', sessionId)

    if (players.length < 2) {
      throw new Error('At least 2 players required')
    }

    session.status = 'active'
    session.startTime = DateTime.now().plus({ seconds: 5 }) // sync start

    await session.save()

    return session
  }

}