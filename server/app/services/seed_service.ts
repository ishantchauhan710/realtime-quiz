import Quiz from '#models/quiz'
import Question from '#models/question'
import Option from '#models/option'
import { quizData } from '../data/quiz.ts'

export default class SeedService {
  static async seedQuizzesIfEmpty() {
    const existing = await Quiz.query().first()

    if (existing) {
      console.log('Quiz data already exists')
      return
    }

    console.log('Adding dummy quiz data...')

    for (const quiz of quizData) {
      const createdQuiz = await Quiz.create({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        timeLimit: quiz.timeLimit,
      })

      for (const q of quiz.questions) {
        const createdQuestion = await Question.create({
          quizId: createdQuiz.id,
          question: q.question,
        })

        for (let i = 0; i < q.options.length; i++) {
          await Option.create({
            questionId: createdQuestion.id,
            text: q.options[i],
            isCorrect: q.correctAnswer === i,
          })
        }
      }
    }

    console.log('Quiz seeding completed')
  }
}