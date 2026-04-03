import Session from '#models/session'
import SessionPlayer from '#models/session_player'
import Question from '#models/question'
import { DateTime } from 'luxon'

export default class QuizEngineService {
    async submitAnswer(userId: number, sessionId: number, selectedOption: number) {
        const session = await Session.findOrFail(sessionId)

        const player = await SessionPlayer
            .query()
            .where('session_id', sessionId)
            .where('user_id', userId)
            .preload('user')
            .firstOrFail()

        if (player.answeredAt) {
            return { leaderboard: [] }
        }

        const question = await Question
            .query()
            .where('quiz_id', session.quizId)
            .orderBy('order_index')
            .offset(player.currentQuestionIndex)
            .firstOrFail()

        let isCorrect = false;

        if (selectedOption === null) {
            // treat unanswered as incorrect
            isCorrect = false;
        } else if (selectedOption === question.correctOption) {
            isCorrect = true;
        }

        if (isCorrect) {
            player.score += 10
        }

        // player.answeredAt = DateTime.now()
        player.currentQuestionIndex++

        await player.save()

        const players = await SessionPlayer
            .query()
            .where('session_id', sessionId)
            .preload('user')

        const leaderboard = players
            .map(p => ({
                userId: p.userId,
                name: p.user.name,
                score: p.score,
                isFinished: p.isFinished,
                profilePictureUrl: p.user.profilePictureUrl,
            }))
            .sort((a, b) => b.score - a.score)

        const update = isCorrect ? `${player.user?.name} +10 points` : null;

        return { leaderboard, correctAnswer: question.correctOption, update: update }
    }
}