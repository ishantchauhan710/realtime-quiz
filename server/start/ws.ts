// import app from '@adonisjs/core/services/app'
// import Ws from '#services/ws'
// import { verifyAccessToken } from '#services/jwt_service'
// import QuizEngineService from '#services/quiz_engine_service'
// import SessionPlayer from '#models/session_player'

// // const quizEngine = new QuizEngineService()

// // app.ready(() => {
// //     Ws.boot()
// //     const io = Ws.io!

// //     io.use((socket, next) => {
// //         try {
// //             const token = socket.handshake.auth.token

// //             if (!token) throw new Error('No token')

// //             const decoded: any = verifyAccessToken(token)

// //             socket.data.userId = decoded.id

// //             next()
// //         } catch {
// //             next(new Error('Unauthorized'))
// //         }
// //     })

// //     io.on('connection', (socket) => {
// //         console.log('Connected:', socket.id)

// //         // JOIN ROOM
// //         socket.on('join_session', async (sessionId: number) => {
// //             const room = `session:${sessionId}`
// //             socket.join(room)

// //             const players = await SessionPlayer
// //                 .query()
// //                 .where('session_id', sessionId)
// //                 .preload('user')

// //             Ws.io!.to(room).emit('room:update', {
// //                 players
// //             })
// //         })

// //         // SUBMIT ANSWER
// //         socket.on('answer:submit', async ({ sessionId, selectedOption }) => {
// //             try {
// //                 const userId = socket.data.userId

// //                 await quizEngine.submitAnswer(userId, sessionId, selectedOption)
// //             } catch (err: any) {
// //                 socket.emit('error', err.message)
// //             }
// //         })

// //         socket.on('disconnect', () => {
// //             console.log('Disconnected:', socket.id)
// //         })
// //     })
// // })