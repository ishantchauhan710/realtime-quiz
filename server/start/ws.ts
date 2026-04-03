import app from '@adonisjs/core/services/app'
import Ws from '#services/ws'
import { verifyAccessToken } from '#services/jwt_service'
import QuizEngineService from '#services/quiz_engine_service'
import SessionPlayer from '#models/session_player'
import Session from '#models/session'
import Question from '#models/question'
import { DateTime } from 'luxon'

const quizEngine = new QuizEngineService()

function formatPlayers(players: any[], hostId: number) {
  return players.map(p => ({
    userId: p.userId,
    name: p.user.name,
    email: p.user.email,
    profilePictureUrl: p.user.profilePictureUrl,
    score: p.score,
    isHost: p.userId === hostId,
  }))
}



async function finishQuiz(io: any, sessionId: number) {
  const players = await SessionPlayer
    .query()
    .where('session_id', sessionId)
    .preload('user')

  const leaderboard = players
    .map(p => ({
      userId: p.userId,
      name: p.user.name,
      score: p.score,
      finishedAt: p.finishedAt,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score

      if (a.finishedAt && b.finishedAt) {
        return a.finishedAt.toMillis() - b.finishedAt.toMillis()
      } else if (a.finishedAt) {
        return -1
      } else if (b.finishedAt) {
        return 1
      } else {
        return 0
      }
    })

  io.to(`session:${sessionId}`).emit('quiz_finished', {
    winner: leaderboard[0],
    leaderboard,
  })
}

async function sendQuestion(io: any, sessionId: number) {
  const session = await Session.findOrFail(sessionId)

  const question = await Question
    .query()
    .where('quiz_id', session.quizId)
    .orderBy('order_index')
    .offset(session.currentQuestionIndex)
    .first()

  if (!question) {
    return finishQuiz(io, sessionId)
  }

  const duration = 10

  io.to(`session:${sessionId}`).emit('question_start', {
    question,
    index: session.currentQuestionIndex,
    duration,
  })

  setTimeout(async () => {
    session.currentQuestionIndex++
    await session.save()

    await sendQuestion(io, sessionId)
  }, duration * 1000)
}


app.ready(() => {
  Ws.boot()
  const io = Ws.io!

  io.use((socket: any, next: any) => {
    try {
      const token = socket.handshake.auth?.token
      const decoded: any = verifyAccessToken(token)
      socket.data.userId = decoded.id
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', (socket: any) => {
    const userId = socket.data.userId



    socket.on('join_session', async ({ sessionId }: { sessionId: number }) => {
      const room = `session:${sessionId}`
      socket.join(room)

      const players = await SessionPlayer
        .query()
        .where('session_id', sessionId)
        .preload('user')

      const session = await Session.findOrFail(sessionId)

      io.to(room).emit(
        'room_update',
        formatPlayers(players, session.createdBy)
      )
    })


    socket.on('start_quiz', async ({ sessionId }: { sessionId: number }) => {
      const session = await Session.findOrFail(sessionId)

      if (session.createdBy !== userId) return

      let count = 5

      const interval = setInterval(() => {
        io.to(`session:${sessionId}`).emit('game_countdown', { count })

        count--

        if (count === 0) {
          clearInterval(interval)

          io.to(`session:${sessionId}`).emit('game_start')

          sendQuestion(io, sessionId)
        }
      }, 1000)
    })

    socket.on('submit_answer', async ({ sessionId, selectedOption }: { sessionId: number, selectedOption: number }) => {
      const result = await quizEngine.submitAnswer(
        userId,
        sessionId,
        selectedOption
      )

      io.to(`session:${sessionId}`).emit(
        'score_update',
        result.leaderboard
      )
    })
  })
})