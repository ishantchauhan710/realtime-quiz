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
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [updates, setUpdates] = useState([] as any[])
    const [quizCompleted, setQuizCompleted] = useState(false)

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


    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        if (players?.length === 0 && retryCount < 5) {
            const retry = setTimeout(() => {
                console.log("Reconnecting socket...")

                socket.disconnect()
                socket.connect()

                setRetryCount(prev => prev + 1)
            }, 1500)

            return () => clearTimeout(retry)
        }
    }, [players])

    // Socket event listeners
    useEffect(() => {
        // Connect to socket
        socket.connect()

        socket.on("connect", () => {
            socket.emit("join_session", { sessionId })
        })

        // Join backend with session ID from params that was created before creating or joining the room
        socket.emit("join_session", { sessionId })

        // When a player joins, update the player list in the room
        socket.on("room_update", (_players) => {
            setPlayers(_players)
            setLeaderboard(_players.map((p: any) => (
                {
                    userId: p.userId,
                    name: p.name,
                    score: p.score,
                    isFinished: p.isFinished,
                    profilePictureUrl: p.profilePictureUrl,
                }
            ))) // Update leaderboard as well on room update

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


        // Game started
        socket.on("score_update", (data) => {
            console.log("Received score update:", data)
            setLeaderboard(data)
        })

        // Notification updates
        socket.on("update", (data) => {
            if (!data) return

            const now = Date.now()

            setUpdates((prev) => {
                // 👉 check last update timestamp
                const last = prev[prev.length - 1]

                if (last && now - last.timestamp < 1000) {
                    return prev // ❌ skip duplicate within 1s
                }

                const id = now

                const newUpdate = {
                    id,
                    text: data,
                    visible: true,
                    timestamp: now,
                }

                // fade + remove logic
                setTimeout(() => {
                    setUpdates((p) =>
                        p.map((u) =>
                            u.id === id ? { ...u, visible: false } : u
                        )
                    )
                }, 1000)

                setTimeout(() => {
                    setUpdates((p) => p.filter((u) => u.id !== id))
                }, 1300)

                return [...prev, newUpdate]
            })
        })

        // Answer result received
        socket.on("answer_result", ({ correctAnswer }) => {
            // console.log("Received answer result. Correct option is:", correctAnswer)
            setCorrectOption(correctAnswer)
        })

        // Received question
        socket.on("question_start", ({ question, index, duration, startedAt }) => {
            setQuestion(question)
            setIndex(index)
            setLoading(false)

            setSelected(null)
            setCorrectOption(null)

            if (timer) clearInterval(timer)

            const endTime = startedAt + duration * 1000

            const updateTimer = () => {
                const now = Date.now()

                const remaining = Math.max(
                    0,
                    Math.ceil((endTime - now) / 1000)
                )

                setTimeLeft(remaining)

                if (remaining <= 0) {
                    clearInterval(timer)

                    socket.emit("submit_answer", {
                        sessionId,
                        selectedOption: null,
                    })
                }
            }

            // run immediately (NO flicker)
            updateTimer()

            // then keep updating
            timer = setInterval(updateTimer, 250)
        })

        // Quiz completed, navigate to results page
        socket.on("quiz_completed", () => {
            setQuizCompleted(true)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    // ================= SUBMIT =================
    const submitAnswer = (optionIndex: number) => {
        // console.log("Submitting answer:", optionIndex)
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

    const handleEndQuiz = () => {
        if (!quizCompleted) {
            const confirmEnd = window.confirm("Are you sure you want to end the quiz?")
            if (confirmEnd) {
                socket.emit("end_quiz", { sessionId })
                setQuizCompleted(true)
                navigate(`/home`)
            }
        } else {
            navigate(`/home`)
        }
    }


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
                <>
                    {/* NOTIFICATIONS */}
                    <div className="fixed top-5 left-1/2 -translate-x-1/2 space-y-2 z-50">
                        {updates.map((u) => (
                            <div
                                key={u.id}
                                className={`px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition-all duration-300
                ${u.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                bg-green-600`}
                            >
                                {u.text}
                            </div>
                        ))}
                    </div>
                    <div className={quizCompleted ? "grid grid-cols-1 gap-10" : "grid grid-cols-2 gap-10"}>
                        {/* QUIZ */}
                        {!quizCompleted && (<div className="w-full mx-auto">

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
                        </div>)}

                        {/* LEADERBOARD */}
                        <div className="w-full mx-auto">
                            <h2 className="text-lg font-semibold mb-4">Leaderboard - {leaderboard?.length}</h2>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                <div className="grid grid-cols-12 px-4 py-3 text-xs text-gray-400 border-b border-zinc-800">
                                    <div className="col-span-6">Player</div>
                                    <div className="col-span-6 text-end">Score</div>
                                    {/* <div className="col-span-3 text-right">Status</div> */}
                                </div>

                                {leaderboard?.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-400">
                                        Waiting for players to join...
                                    </div>
                                ) : (
                                    leaderboard?.map((p) => (
                                        <div
                                            key={p.userId}
                                            className="grid grid-cols-12 px-4 py-3 text-sm border-b border-zinc-800"
                                        >
                                            <div className="col-span-6 flex items-center gap-3">
                                                <img
                                                    src={API + p.profilePictureUrl}
                                                    alt={p.name}
                                                    className="w-8 h-8 object-cover rounded-full"
                                                />
                                                <span>{p.name}</span>
                                            </div>
                                            <div className="col-span-6 text-end font-medium">
                                                {p.score}
                                            </div>
                                            {/* <div className="col-span-3 text-right">
                                            {p.isFinished ? (
                                                <span className="text-green-400">Finished</span>
                                            ) : (
                                                <span className="text-yellow-400">Playing</span>
                                            )}
                                        </div> */}
                                        </div>
                                    ))
                                )}


                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <button onClick={() => handleEndQuiz()} className={quizCompleted ? "bg-green-500 text-white px-3 py-3 rounded-md cursor-pointer hover:bg-green-600" : "bg-red-500 text-white px-3 py-3 rounded-md cursor-pointer hover:bg-red-600"}>
                                    {quizCompleted ? "Go To Home" : "End Quiz"}
                                </button>
                            </div>

                        </div>
                    </div>
                </>
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

                            {players?.length === 0 ? (
                                <div className="p-4 text-sm text-gray-400">
                                    Waiting for players to join...
                                </div>
                            ) : (
                                players?.map((p) => (
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