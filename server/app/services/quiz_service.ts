import Quiz from '#models/quiz'

export default class QuizService {

  async getAll() {
    const quizzes = await Quiz.query()
      .select('id', 'title', 'description', 'category', 'timeLimit')

    return quizzes
  }

  async getById(id: number) {
    const quiz = await Quiz.query()
      .where('id', id)
      .preload('questions', (q) => {
        q.preload('options')
      })
      .first()

    if (!quiz) return null

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => {
        const correctIndex = q.options.findIndex(o => o.isCorrect)

        return {
          id: q.id,
          question: q.question,
          options: q.options.map(o => o.text),
          correctAnswer: correctIndex
        }
      })
    }
  }
}