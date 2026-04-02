import { useEffect, useState } from "react";
import { API } from "../lib/api";
import { getToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import PageContainer from "./PageContainer";

export default function MultiplayerEntry() {
    const navigate = useNavigate();

    const [mode, setMode] = useState<"create" | "join" | null>(null);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState("");
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const res = await fetch(API + "/quizzes", {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            });
            const data = await res.json();
            setQuizzes(data);
        };

        fetchQuizzes();
    }, []);

    // CREATE ROOM
    const handleCreate = async () => {
        if (!selectedQuiz) return;

        setLoading(true);

        const res = await fetch(API + "/sessions/multiplayer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify({ quizId: selectedQuiz }),
        });

        const data = await res.json();

        setCreatedCode(data.sessionId); // use sessionId as code
        setLoading(false);
    };

    // JOIN ROOM
    const handleJoin = () => {
        if (!joinCode) return;
        navigate(`/multiplayer/${joinCode}`);
    };

    return (
        <PageContainer>
            <div className="min-h-screen bg-gray-950 text-white w-full flex items-start justify-center">
                <div className="w-full max-w-xl bg-gray-900 rounded-2xl p-6 shadow-xl">

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Multiplayer Mode 🎮
                    </h2>

                    {/* MODE SELECT */}
                    {!mode && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setMode("create")}
                                className="w-full p-4 bg-white text-black rounded-xl hover:opacity-90"
                            >
                                Create Room
                            </button>

                            <button
                                onClick={() => setMode("join")}
                                className="w-full p-4 bg-gray-800 rounded-xl hover:bg-gray-700"
                            >
                                Join Room
                            </button>
                        </div>
                    )}

                    {/* CREATE ROOM */}
                    {mode === "create" && !createdCode && (
                        <div className="space-y-4">

                            <h3 className="text-lg font-semibold">Select Quiz</h3>

                            <div className="space-y-2 max-h-60 overflow-auto">
                                {quizzes.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setSelectedQuiz(q.id)}
                                        className={`w-full p-3 rounded-lg text-left border ${selectedQuiz === q.id
                                                ? "bg-white text-black"
                                                : "bg-gray-800 border-gray-700"
                                            }`}
                                    >
                                        {q.title}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!selectedQuiz || loading}
                                className="w-full p-3 bg-white text-black rounded-lg"
                            >
                                {loading ? "Creating..." : "Create Room"}
                            </button>
                        </div>
                    )}

                    {/* SHOW JOIN CODE */}
                    {createdCode && (
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">Room Created 🎉</h3>

                            <div className="bg-gray-800 p-4 rounded-xl text-xl font-mono">
                                {createdCode}
                            </div>

                            <p className="text-gray-400 text-sm">
                                Share this code with friends
                            </p>

                            <button
                                onClick={() => navigate(`/multiplayer/${createdCode}`)}
                                className="w-full p-3 bg-white text-black rounded-lg"
                            >
                                Enter Room
                            </button>
                        </div>
                    )}

                    {/* JOIN ROOM */}
                    {mode === "join" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Enter Room Code</h3>

                            <input
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                placeholder="e.g. abc123"
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none"
                            />

                            <button
                                onClick={handleJoin}
                                className="w-full p-3 bg-white text-black rounded-lg"
                            >
                                Join Room
                            </button>
                        </div>
                    )}

                    {/* BACK */}
                    {mode && (
                        <button
                            onClick={() => {
                                setMode(null);
                                setCreatedCode(null);
                            }}
                            className="mt-6 text-sm text-gray-400 hover:text-white"
                        >
                            ← Back
                        </button>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}