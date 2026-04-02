import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "./PageContainer";
import { API } from "../lib/api";

export default function MultiplayerRoom({ user }: any) {
    const { id } = useParams();
    const sessionId = Number(id);
    const navigate = useNavigate();

    const [players, setPlayers] = useState<any[]>([]);
    const [hostId, setHostId] = useState<number | null>(null);

    // JOIN ROOM
    useEffect(() => {
        socket.emit("join_session", {
            sessionId,
            user,
        });

        socket.on("session_update", (data) => {
            // console.log('Session Update:', data)
            setPlayers(data.players);

            // first player = host
            if (data.players.length > 0) {
                setHostId(data.players[0].userId);
            }
        });

        socket.on("game_started", () => {
            navigate(`/quiz/${sessionId}`);
        });

        return () => {
            socket.off("session_update");
            socket.off("game_started");
        };
    }, []);

    // START GAME
    const handleStart = () => {
        socket.emit("start_game", {
            sessionId,
            user,
        });
    };

    return (
        <PageContainer>
            <div className="min-h-screen bg-gray-950 text-white flex justify-center">
                <div className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl">

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Room #{sessionId}
                    </h2>

                    {/* PLAYERS */}
                    <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-semibold">Players ({players.length})</h3>

                        {players.length === 0 && (
                            <p className="text-gray-400">Waiting for players...</p>
                        )}

                        {players.map((p, i) => (
                            <div
                                key={p.id}
                                className="p-3 bg-gray-800 rounded-lg flex justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <img src={API + p.avatar} alt={p.name} className="w-8 h-8 rounded-full mr-3" />
                                    <span>{p.name}</span>
                                </div>

                                {p.userId === hostId && (
                                    <span className="text-green-400 text-sm">HOST</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* START BUTTON */}
                    {user.id === hostId && (
                        <button
                            onClick={handleStart}
                            className="w-full p-3 bg-white text-black rounded-lg"
                        >
                            Start Quiz 🚀
                        </button>
                    )}

                    {/* NON-HOST MESSAGE */}
                    {user.id !== hostId && (
                        <p className="text-center text-gray-400">
                            Waiting for host to start...
                        </p>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}