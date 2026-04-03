import User from '#models/user'

export default class LeaderboardService {

  async getGlobalLeaderboard(limit: number = 50) {

    const users = await User
      .query()
      .select(
        'id',
        'name',
        'profilePictureUrl',
        'totalWinsSolo',
        'totalWinsMulti'
      )
      .orderByRaw('(total_wins_solo + total_wins_multi) DESC')
      .limit(limit)

    let rank = 1
    let lastScore: number | null = null

    const leaderboard = users.map((user, index) => {
      const totalWins = user.totalWinsSolo + user.totalWinsMulti

      // handle ties
      if (totalWins !== lastScore) {
        rank = index + 1
        lastScore = totalWins
      }

      return {
        rank,
        userId: user.id,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        totalWins,
        soloWins: user.totalWinsSolo,
        multiWins: user.totalWinsMulti,
      }
    })

    return leaderboard
  }
}