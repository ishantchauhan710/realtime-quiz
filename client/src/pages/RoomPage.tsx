// (same imports)
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
    const [quizStarted, setQuizStarted] = useState(false)

    const [index, setIndex] = useState(0)
    const [question, setQuestion] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selected, setSelected] = useState<number | null>(null)
    const [correctOption, setCorrectOption] = useState<number | null>(null)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)

    let timer: any = null


    // Check if room exists
    useEffect(() => {
        const checkRoom = async () => {
            try {
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
            } catch {
                setError("Room not found or expired")
            }
        }

        checkRoom()
    }, [])

    // Socket event listeners
    useEffect(() => {
        // Connect to socket
        socket.connect()

        // Join backend with session ID from params that was created before creating or joining the room
        socket.emit("join_session", { sessionId })

        // When a player joins, update the player list in the room
        socket.on("room_update", (_players) => {
            setPlayers(_players)

            // Host check
            const me = _players.find((p: any) => p.userId === myUserId)
            setIsHost(me?.isHost || false)
        })

        // Game start countdown 
        socket.on("game_countdown", ({ count }) => {
            setCountdown(count)
        })

        // Game started
        socket.on("game_start", () => {
            setQuizStarted(true)
        })

        // Answer result received
        socket.on("answer_result", ({ correctAnswer }) => {
            console.log('hi')
            console.log("Received answer result. Correct option is:", correctAnswer)
            setCorrectOption(correctAnswer)
        })

        // Received question
        socket.on("question_start", ({ question, index, duration }) => {
            console.log("Received question:", question)
            setQuestion(question)
            setIndex(index)
            setLoading(false)

            setSelected(null)
            setCorrectOption(null)
            setTimeLeft(duration)

            // reset timer
            if (timer) clearInterval(timer)

            let time = duration

            timer = setInterval(() => {
                time--
                setTimeLeft(time)

                if (time <= 0) {
                    clearInterval(timer)
                }
            }, 1000)
        })

        // Quiz completed, navigate to results page
        socket.on("quiz_completed", () => {
            navigate("/results/" + sessionId)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    // ================= SUBMIT =================
    const submitAnswer = (optionIndex: number) => {
        console.log("Submitting answer:", optionIndex)
        if (submitting || selected !== null) return

        setSubmitting(true)
        setSelected(optionIndex)

        socket.emit("submit_answer", {
            sessionId,
            selectedOption: optionIndex,
        })

        setTimeout(() => {
            setSubmitting(false)
        }, 500)
    }

    // ================= UI HELPERS =================
    const getOptionStyle = (i: number) => {
        if (correctOption === null) {
            return "bg-zinc-900 border-zinc-700 hover:border-white";
        }

        if (i === correctOption) {
            return "bg-green-600 border-green-400";
        }

        if (i === selected && i !== correctOption) {
            return "bg-red-600 border-red-400";
        }

        return "bg-zinc-900 border-zinc-700 opacity-50";
    };


    // ================= UI =================

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

            {quizStarted && (
                <div className="max-w-2xl mx-auto">

                    {/* HEADER */}
                    {!error && (
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Question {index + 1}</span>
                                <span>Score: {score}</span>
                            </div>

                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all"
                                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                                />
                            </div>

                            <div className="text-right text-xs text-gray-500 mt-1">
                                {timeLeft}s
                            </div>
                        </div>
                    )}

                    {/* QUESTION */}
                    {!loading && question && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">
                                Q{index + 1}. {question.questionText}
                            </h2>

                            <div className="space-y-3">
                                {question.options.map((opt: string, i: number) => (
                                    <button
                                        key={i}
                                        disabled={submitting}
                                        onClick={() => submitAnswer(i)}
                                        className={`w-full text-left p-4 rounded-lg border transition ${getOptionStyle(i)}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!quizStarted && (
                <div className="max-w-3xl mx-auto">

                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">
                            Room #{sessionId}
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Share this room ID with your friends
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Players</h2>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                            <div className="grid grid-cols-12 px-4 py-3 text-xs text-gray-400 border-b border-zinc-800">
                                <div className="col-span-5">Player</div>
                                <div className="col-span-4">Email</div>
                                <div className="col-span-2 text-center">Score</div>
                                <div className="col-span-1 text-right">Role</div>
                            </div>

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

                                        <div className="col-span-4 text-sm text-gray-400 truncate">
                                            {p.email}
                                        </div>

                                        <div className="col-span-2 text-center font-semibold">
                                            {p.score ?? 0}
                                        </div>

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

                    {isHost && countdown === null && (
                        <button
                            onClick={() => {
                                // if (players.length < 2) {
                                //     alert("At least 2 players required to start")
                                //     return
                                // }

                                socket.emit("start_quiz", { sessionId })
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-medium cursor-pointer"
                        >
                            Start Game
                        </button>
                    )}
                </div>
            )}
        </PageContainer>
    )
}