import vine from '@vinejs/vine'

export const createQuizValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    description: vine.string().optional(),
    timePerQuestion: vine.number().positive(),

    questions: vine.array(
      vine.object({
        questionText: vine.string().minLength(5),
        options: vine.array(vine.string()).minLength(2),
        correctOption: vine.number(),
      })
    ),
  })
)

export const updateQuizValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    description: vine.string().optional(),
    timePerQuestion: vine.number().positive().optional(),

    questions: vine
      .array(
        vine.object({
          id: vine.number().optional(),
          questionText: vine.string().minLength(5),
          options: vine.array(vine.string()).minLength(2),
          correctOption: vine.number(),
        })
      )
      .optional(),
  })
)