// app/utils/handle_error.ts
import type { HttpContext } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import AppError from '#exceptions/app_error'

export function handleError(error: unknown, response: HttpContext['response']) {
  if (error instanceof vineErrors.E_VALIDATION_ERROR) {
    return response.badRequest({
      error: 'Validation failed',
      fields: error.messages,
    })
  }

  if (error instanceof AppError) {
    return response.status(error.status).send({
      error: error.message,
      code: error.code,
    })
  }

  return response.internalServerError({
    error: 'Something went wrong',
  })
}