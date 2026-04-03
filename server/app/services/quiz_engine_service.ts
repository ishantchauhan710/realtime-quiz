// import Session from '#models/session'
// import SessionPlayer from '#models/session_player'
// import Question from '#models/question'
// // import Ws from '#services/ws'

// export default class QuizEngineService {

//   async submitAnswer(userId: number, sessionId: number, selectedOption: number) {
//     const session = await Session.findOrFail(sessionId)

//     const player = await SessionPlayer
//       .query()
//       .where('session_id', sessionId)
//       .where('user_id', userId)
//       .firstOrFail()

//     const question = await Question
//       .query()
//       .where('quiz_id', session.quizId)
//       .orderBy('order_index')
//       .offset(session.currentQuestionIndex)
//       .firstOrFail()

//     const isCorrect = question.correctOption === selectedOption

//     if (isCorrect) {
//       player.score += 10
//     }

//     await player.save()

//     // broadcast leaderboard
//     const players = await SessionPlayer
//       .query()
//       .where('session_id', sessionId)
//       .preload('user')

//     const leaderboard = players
//       .map(p => ({
//         userId: p.userId,
//         name: p.user.name,
//         score: p.score,
//       }))
//       .sort((a, b) => b.score - a.score)

//     // Ws.io!
//     //   .to(`session:${sessionId}`)
//     //   .emit('score:update', leaderboard)
//   }
// }