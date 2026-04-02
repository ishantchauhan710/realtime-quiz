import app from '@adonisjs/core/services/app'
import Ws from '../app/services/socket_service.ts'
import SessionService from '#services/session_service'

app.ready(() => {
    Ws.boot()

    Ws.io?.on('connection', (socket) => {
        console.log('Socket Connected:', socket.id)

        socket.on('join_session', async ({ sessionId, user }) => {
            try {
                
                await SessionService.joinMultiplayerSession(
                    user.id,
                    sessionId
                )

                const room = `session_${sessionId}`
                socket.join(room)

                const players = await SessionService.getSessionPlayers(sessionId)
                console.log('Players in session', sessionId, players)

                Ws.io?.to(room).emit('session_update', {
                    sessionId,
                    players,
                })

            } catch (error: Error | any) {
                socket.emit('error', error.message)
            }
        })

        socket.on('disconnect', () => {
            console.log('Disconnected:', socket.id)
        })
    })
})