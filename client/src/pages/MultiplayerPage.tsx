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

  // LOAD QUIZZES
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log("[API] GET /quizzes");

        const token = getToken();

        const res = await fetch(API + "/quizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("[API] quizzes loaded", { count: data.length });

        setQuizzes(data);
      } catch (err) {
        console.log("[API ERROR] fetchQuizzes", err);
      }
    };

    fetchQuizzes();
  }, []);

  // SOCKET CONNECT
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("[WS CONNECT]", { socketId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("[WS DISCONNECT]");
    });

    // ROOM UPDATE
    socket.on("room_update", (players) => {
      console.log("[WS EVENT] room_update", players)

      setPlayers(players)

      // find current user
      const me = players.find((p: any) => p.isHost)

      if (me) {
        setIsHost(true)
      } else {
        setIsHost(false)
      }
    })

    // QUIZ STARTED
    socket.on("quiz_started", ({ sessionId, startTime }) => {
      console.log("[WS EVENT] quiz_started", {
        sessionId,
        startTime,
      });

      navigate(`/room/${sessionId}`);
    });

    // ERROR HANDLING
    socket.on("error", (msg) => {
      console.log("[WS ERROR]", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // CREATE ROOM
  const createRoom = async () => {
    if (!selectedQuiz) return;

    try {
      console.log("[API] POST /sessions/multiplayer", {
        quizId: selectedQuiz,
      });

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

      console.log("[API] session created", {
        sessionId: data.sessionId,
      });

      setSessionId(data.sessionId);
      navigate(`/room/${data.sessionId}`)
      // setIsHost(true);

      console.log("[WS EMIT] join_session", {
        sessionId: data.sessionId,
      });

      socket.emit("join_session", { sessionId: data.sessionId });
    } catch (err) {
      console.log("[API ERROR] createRoom", err);
    }
  };

  // JOIN ROOM
  const joinRoom = async () => {
    try {
      console.log("[API] POST /sessions/:id/join", {
        sessionId: joinInput,
      });

      const token = getToken();

      await fetch(API + `/sessions/${joinInput}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const id = Number(joinInput);

      setSessionId(id);

      navigate(`/room/${id}`)
      console.log("[WS EMIT] join_session", { sessionId: id });

      socket.emit("join_session", { sessionId: id });
    } catch (err) {
      console.log("[API ERROR] joinRoom", err);
    }
  };

  // START GAME (SOCKET ONLY)
  const startGame = () => {
    console.log("[WS EMIT] start_quiz", { sessionId });

    socket.emit("start_quiz", { sessionId });
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
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        p.profilePictureUrl
                          ? `http://localhost:3333${p.profilePictureUrl}`
                          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`
                      }
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </div>
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