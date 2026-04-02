import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request }: HttpContext) {

    const data = request.only(['email', 'password', 'name'])
    return await User.create(data)
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user) return 'User not found'

    return user
  }
}