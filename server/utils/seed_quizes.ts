import Quiz from '#models/quiz'
import Question from '#models/question'
import { quizData } from '../data/quiz.ts'

export async function seedDefaultQuizzes() {
    console.log('Checking default quizzes...')

    const existing = await Quiz.query().where('is_default', true).first()

    if (existing) {
        console.log('Default quizzes already exist')
        return
    }

    console.log('Seeding default quizzes...')

    for (const quiz of quizData) {
        const createdQuiz = await Quiz.create({
            title: quiz.title,
            description: quiz.description,
            totalQuestions: quiz.questions.length,
            timePerQuestion: quiz.timeLimit,
            isDefault: true,
            createdBy: null,
        })

        const questions = quiz.questions.map((q, index) => ({
            quizId: createdQuiz.id,
            questionText: q.question,
            options: q.options,
            correctOption: q.correctAnswer,
            orderIndex: index,
        }))

        await Question.createMany(questions)
    }

    console.log('Default quizzes seeded successfully')
}