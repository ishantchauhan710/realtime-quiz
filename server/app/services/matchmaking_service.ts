export default class MatchmakingService {
  private queue: {
    userId: number
    socketId: string
    quizId: number
  }[] = []

  addPlayer(userId: number, socketId: string, quizId: number) {
    // ❗ prevent duplicate
    const exists = this.queue.find(p => p.userId === userId)
    if (exists) return

    this.queue.push({ userId, socketId, quizId })

    console.log("QUEUE AFTER ADD:", this.queue) // 👈 debug
  }

  getCount() {
    return this.queue.length
  }

  getAllQuizIds() {
    return [...new Set(this.queue.map(p => p.quizId))]
  }

  popPlayers(quizId: number) {
    const players = this.queue
      .filter(p => p.quizId === quizId)
      .slice(0, 2)

    if (players.length < 2) return null

    this.queue = this.queue.filter(
      p => !players.find(mp => mp.userId === p.userId)
    )

    return players
  }
}