import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { socket } from "../lib/socket"
import { getToken } from "../lib/auth"
import PageContainer from "./PageContainer"

export default function RoomPage() {
    const { id } = useParams()
    const sessionId = Number(id)

    const token = getToken()
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
    const myUserId = payload?.id

    const API = "http://localhost:3333"
    const navigate = useNavigate()

    const [players, setPlayers] = useState<any[]>([])
    const [error, setError] = useState("")
    const [isHost, setIsHost] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)

    const [gameStarted, setGameStarted] = useState(false)

    const [question, setQuestion] = useState<any>(null)
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    const [selected, setSelected] = useState<number | null>(null)
    const [correctOption, setCorrectOption] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [timeLeft, setTimeLeft] = useState(10)
    const [leaderboard, setLeaderboard] = useState<any[]>([])



    useEffect(() => {
        const checkRoom = async () => {
            try {
                console.log("[API] GET /sessions/:id", { sessionId })

                const token = getToken()

                const res = await fetch(API + `/sessions/${sessionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    setError("Room not found or expired")
                    return
                }

                const data = await res.json()

                console.log("[API] room validated", data)

                // setIsHost(data.createdBy === data.currentUserId)
            } catch (err) {
                console.log("[API ERROR] checkRoom", err)
                setError("Room not found or expired")
            }
        }

        checkRoom()
    }, [])



    useEffect(() => {
        console.log("[WS] connecting room", { sessionId })

        socket.connect()

        socket.emit("join_session", { sessionId })

        socket.on("room_update", (_players) => {
            console.log("[WS EVENT] room_update", _players)

            setPlayers(_players)

            const me = _players.find((p: any) => p.userId === myUserId)

            console.log("[WS DEBUG] me", me)

            setIsHost(me?.isHost || false)
        })

        socket.on("game_countdown", ({ count }) => {
            console.log("[WS EVENT] game_countdown", { count })
            setCountdown(count)
        })

        socket.on("game_start", () => {
            console.log("[WS EVENT] game_start")
            navigate(`/play/${sessionId}`)
        })

        socket.on("error", (msg) => {
            console.log("[WS ERROR]", msg)
        })

        return () => {
            console.log("[WS] disconnect room")
            socket.disconnect()
        }
    }, [])



    if (error) {
        return (
            <PageContainer>
                <div className="text-center mt-20">
                    <h2 className="text-xl text-red-400">{error}</h2>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">
                        Room #{sessionId}
                    </h1>

                    <p className="text-gray-400 text-sm mt-1">
                        Share this room ID with your friends
                    </p>
                </div>

                {/* PLAYERS TABLE */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Players</h2>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                        {/* HEADER */}
                        <div className="grid grid-cols-12 px-4 py-3 text-xs text-gray-400 border-b border-zinc-800">
                            <div className="col-span-5">Player</div>
                            <div className="col-span-4">Email</div>
                            <div className="col-span-2 text-center">Score</div>
                            <div className="col-span-1 text-right">Role</div>
                        </div>

                        {/* ROWS */}
                        {players.length === 0 ? (
                            <div className="p-4 text-sm text-gray-400">
                                Waiting for players to join...
                            </div>
                        ) : (
                            players.map((p) => (
                                <div
                                    key={p.userId}
                                    className="grid grid-cols-12 items-center px-4 py-3 border-b border-zinc-800 last:border-none hover:bg-zinc-800/40 transition"
                                >
                                    {/* PLAYER */}
                                    <div className="col-span-5 flex items-center gap-3">
                                        <img
                                            src={
                                                p.profilePictureUrl
                                                    ? API + p.profilePictureUrl
                                                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`
                                            }
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="font-medium">{p.name}</span>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="col-span-4 text-sm text-gray-400 truncate">
                                        {p.email}
                                    </div>

                                    {/* SCORE */}
                                    <div className="col-span-2 text-center font-semibold">
                                        {p.score ?? 0}
                                    </div>

                                    {/* ROLE */}
                                    <div className="col-span-1 text-right">
                                        {p.isHost && (
                                            <span className="text-xs bg-green-600 px-2 py-1 rounded-md">
                                                Host
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COUNTDOWN */}
                {countdown !== null && (
                    <div className="text-center mb-6">
                        <div className="text-gray-400 text-sm mb-2">
                            Game starting in
                        </div>
                        <div className="text-5xl font-bold">
                            {countdown}
                        </div>
                    </div>
                )}

                {/* START BUTTON */}
                {isHost && countdown === null && (
                    <button
                        onClick={() => {
                            if (players.length < 2) {
                                alert("At least 2 players required to start")
                                return
                            }

                            console.log("[WS EMIT] start_quiz", { sessionId })

                            socket.emit("start_quiz", { sessionId })
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-medium cursor-pointer"
                    >
                        Start Game
                    </button>
                )}

            </div>
        </PageContainer>
    )
}