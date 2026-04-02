// app/middleware/jwt_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import { verifyAccessToken } from '#services/jwt_service'
import User from '#models/user'

export default class JwtMiddleware {
    async handle({ request, response }: HttpContext, next: () => Promise<void>) {
        const authHeader = request.header('authorization')

        if (!authHeader) {
            return response.unauthorized({ error: 'No token' })
        }

        try {
            const token = authHeader.replace('Bearer ', '')
            const decoded: any = verifyAccessToken(token)

            const user = await User.find(decoded.id)
            if (!user) {
                return response.unauthorized({ error: 'Invalid token' })
            }


            // This ts bug can be solved by using a custom ts declare file but im using this quick fix for now
            (request as any).user = user

            await next()
        } catch {
            return response.unauthorized({ error: 'Invalid or expired token' })
        }
    }
}