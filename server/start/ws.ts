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
  return players.map((p) => ({
    userId: p.userId,
    name: p.user.name,
    email: p.user.email,
    profilePictureUrl: p.user.profilePictureUrl,
    score: p.score,
    isHost: p.userId === hostId,
  }))
}

async function finishQuiz(io: any, sessionId: number) {
  const players = await SessionPlayer.query()
    .where('session_id', sessionId)
    .preload('user')

  const leaderboard = players
    .map((p) => ({
      userId: p.userId,
      name: p.user.name,
      score: p.score,
      finishedAt: p.finishedAt,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score

      if (a.finishedAt && b.finishedAt) {
        return a?.finishedAt?.toMillis() - b?.finishedAt?.toMillis()
      } else if (a.finishedAt) return -1
      else if (b.finishedAt) return 1
      else return 0
    })

  io.to(`session:${sessionId}`).emit('quiz_finished', {
    winner: leaderboard[0],
    leaderboard,
  })
}

async function checkAndFinishQuiz(io: any, sessionId: number) {
  const players = await SessionPlayer.query().where('session_id', sessionId)

  const allFinished = players.every((p) => p.finishedAt)

  if (allFinished) {
    await finishQuiz(io, sessionId)
  }
}

async function sendQuestionToPlayer(socket: any, sessionPlayer: any) {
  const session = await Session.findOrFail(sessionPlayer.sessionId)

  const question = await Question.query()
    .where('quiz_id', session.quizId)
    .orderBy('order_index')
    .offset(sessionPlayer.currentQuestionIndex)
    .first()

  if (!question) {
    sessionPlayer.finishedAt = DateTime.now().toISO()
    await sessionPlayer.save()

    socket.emit('quiz_completed')
    await checkAndFinishQuiz(socket.server, session.id)
    return
  }

  const duration = 10

  socket.emit('question_start', {
    question,
    index: sessionPlayer.currentQuestionIndex,
    duration,
  })

  setTimeout(async () => {
    console.log('Timer expired for user', duration, 'seconds')
    const freshPlayer = await SessionPlayer.query()
      .where('session_id', session.id)
      .andWhere('user_id', sessionPlayer.userId)
      .first()

    // prevent double execution (if already answered)
    if (!freshPlayer || freshPlayer.answeredAt) return

    console.log("Time up; auto next question")

    await sendQuestionToPlayer(socket, freshPlayer)
  }, (duration + 1) * 1000)
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

      const players = await SessionPlayer.query()
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

      const players = await SessionPlayer.query().where(
        'session_id',
        sessionId
      )

      for (const p of players) {
        p.currentQuestionIndex = 0
        p.score = 0
        p.finishedAt = null
        // p.answeredAt = null
        await p.save()
      }

      let count = 5

      const interval = setInterval(() => {
        io.to(`session:${sessionId}`).emit('game_countdown', { count })
        count--

        if (count === 0) {
          clearInterval(interval)

          io.to(`session:${sessionId}`).emit('game_start')

          for (const player of players) {
            const playerSocket = [...io.sockets.sockets.values()].find(
              (s: any) => s.data.userId === player.userId
            )

            if (playerSocket) {
              sendQuestionToPlayer(playerSocket, player)
            }
          }
        }
      }, 1000)
    })

    socket.on(
      'submit_answer',
      async ({
        sessionId,
        selectedOption,
      }: {
        sessionId: number
        selectedOption: number
      }) => {
        console.log('Received answer submission')

        const result = await quizEngine.submitAnswer(
          userId,
          sessionId,
          selectedOption
        )

        socket.emit('answer_result', {
          correctAnswer: result.correctAnswer,
        })

        // add 1 second delay before sending the next question to allow clients to show correct/incorrect feedback
        await new Promise((resolve) => setTimeout(resolve, 1000))

        socket.emit('answer_result', {
          correctAnswer: null
        })


        io.to(`session:${sessionId}`).emit(
          'score_update',
          result.leaderboard
        )


        const freshPlayer = await SessionPlayer.query()
          .where('session_id', sessionId)
          .andWhere('user_id', userId)
          .firstOrFail()

        io.to(`session:${sessionId}`).emit(
          'update',
          result.update
        )

        await sendQuestionToPlayer(socket, freshPlayer)
      }
    )
  })
})