import { useEffect, useState } from "react"
import { socket } from "../lib/socket"
import { useNavigate } from "react-router-dom"
import PageContainer from "./PageContainer"

export default function LobbyPage() {
  const navigate = useNavigate()

  const [count, setCount] = useState(0)
  const [status, setStatus] = useState("Joining lobby... If queue count doesn't update, a quick refresh usually fixes it.")

  useEffect(() => {
    socket.connect()

    // join lobby
    socket.emit("join_lobby", {
      quizId: 1 // or selected quiz
    })

    socket.on("lobby_update", ({ count }) => {
      setCount(count)
    })

    socket.on("lobby_waiting", () => {
      setStatus("Waiting for players. If no one shows up, a quick refresh usually fixes it.");
    })

    socket.on("match_found", ({ sessionId }) => {
      socket.emit("join_session", { sessionId })
      navigate(`/room/${sessionId}`)
    })

    return () => {
      socket.off("lobby_update")
      socket.off("lobby_waiting")
      socket.off("match_found")
    }
  }, [])

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto text-center mt-20">

        <h1 className="text-3xl font-semibold mb-6">
          Public Lobby
        </h1>

        <p className="text-gray-400 mb-6">
          {status}
        </p>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-10">
          <p className="text-gray-400 text-sm mb-2">
            Players in queue
          </p>

          <div className="text-5xl font-bold">
            {count}
          </div>
        </div>

        <p className="text-gray-500 mt-6 text-sm">
          Match starts automatically when 2 players join
        </p>
      </div>
    </PageContainer>
  )
}