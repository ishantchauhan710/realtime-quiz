import { quizData } from "../data/quiz.ts"

export default class QuizService {
  getAll() {
    return quizData
  }

  getById(id: number) {
    return quizData.find((q) => q.id === id)
  }
}