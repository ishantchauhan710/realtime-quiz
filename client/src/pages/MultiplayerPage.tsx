import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import PageContainer from "./PageContainer";
import { socket } from "../lib/socket";

export default function MultiplayerPage() {
  const API = "http://localhost:3333";
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [joinInput, setJoinInput] = useState("");

  const [players, setPlayers] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);

  // 🔹 Load quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = getToken();

      const res = await fetch(API + "/quizzes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  // SOCKET CONNECT
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ socket connected");
    });

    // PLAYER UPDATE EVENT
    socket.on("room:update", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Create room
  const createRoom = async () => {
    if (!selectedQuiz) return;

    const token = getToken();

    const res = await fetch(API + "/sessions/multiplayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quizId: selectedQuiz }),
    });

    const data = await res.json();

    setSessionId(data.sessionId);
    setIsHost(true);

    // JOIN SOCKET ROOM
    socket.emit("join_session", data.sessionId);
  };

  // Join room
  const joinRoom = async () => {
    const token = getToken();

    await fetch(API + `/sessions/${joinInput}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSessionId(Number(joinInput));

    // JOIN SOCKET ROOM
    socket.emit("join_session", Number(joinInput));
  };

  // Start game
  const startGame = async () => {
    const token = getToken();

    await fetch(API + `/sessions/${sessionId}/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // next step later
    navigate(`/room/${sessionId}`);
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">

        {!sessionId ? (
          <>
            <h1 className="text-2xl font-semibold mb-6">Multiplayer</h1>

            {/* CREATE */}
            <div className="mb-8">
              <h2 className="text-lg mb-3">Create Room</h2>

              <select
                onChange={(e) => setSelectedQuiz(Number(e.target.value))}
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg mb-3"
              >
                <option>Select Quiz</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>

              <button
                onClick={createRoom}
                className="w-full bg-white text-black py-2 rounded-lg"
              >
                Create Room
              </button>
            </div>

            {/* JOIN */}
            <div>
              <h2 className="text-lg mb-3">Join Room</h2>

              <input
                placeholder="Enter Room ID"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg mb-3"
              />

              <button
                onClick={joinRoom}
                className="w-full bg-white text-black py-2 rounded-lg"
              >
                Join Room
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ROOM */}
            <h1 className="text-2xl font-semibold mb-4">
              Room ID: {sessionId}
            </h1>

            <p className="text-gray-400 text-sm mb-6">
              Share this ID with friends
            </p>

            {/* PLAYERS */}
            <div className="mb-6">
              <h2 className="text-lg mb-3">Players</h2>

              <div className="space-y-2">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-zinc-900 rounded-lg border border-zinc-700"
                  >
                    {p.user.name}
                  </div>
                ))}
              </div>
            </div>

            {/* START */}
            {isHost && (
              <button
                onClick={startGame}
                className="w-full bg-green-600 py-3 rounded-lg"
              >
                Start Game
              </button>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}