export type CreateQuestionInput = {
    questionText: string
    options: string[]
    correctOption: number
}

export type CreateQuizInput = {
    title: string
    description?: string
    timePerQuestion: number
    questions: CreateQuestionInput[]
}

type UpdateQuestionInput = {
    id?: number
    questionText: string
    options: string[]
    correctOption: number
}

export type UpdateQuizInput = {
    title?: string
    description?: string
    timePerQuestion?: number
    questions?: UpdateQuestionInput[]
}