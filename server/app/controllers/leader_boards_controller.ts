import type { HttpContext } from '@adonisjs/core/http'
import { handleError } from '#exceptions/handle_error'
import LeaderboardService from '#services/leader_board_service'

const leaderboardService = new LeaderboardService()

export default class LeaderboardController {

  async global({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 50)

      const data = await leaderboardService.getGlobalLeaderboard(limit)

      return response.ok(data)

    } catch (error) {
      return handleError(error, response)
    }
  }

}