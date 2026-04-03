import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";
import PageContainer from "./PageContainer";

export default function ResultPage() {
    const { id } = useParams();
    const sessionId = Number(id);

    const API = "http://localhost:3333";
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchResult = async () => {
        try {
            const token = getToken();

            const res = await fetch(
                API + `/sessions/${sessionId}/result`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!data.finished) {
                navigate("/");
                return;
            }

            setScore(data.score);
            setTotal(data.totalQuestions || 10); // fallback
        } catch (err) {
            console.error("Failed to fetch result");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!sessionId) return;
        fetchResult();
    }, [sessionId]);

    const percentage = total ? Math.round((score / (total * 10)) * 100) : 0;


    return (
        <PageContainer>
            <div className="max-w-xl mx-auto text-center mt-20">

                {loading ? (
                    <p className="text-gray-400">Loading result...</p>
                ) : (
                    <>
                        {/* Title */}
                        <h1 className="text-3xl font-bold mb-4">
                            Quiz Completed 🎉
                        </h1>

                        {/* Score */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                            <p className="text-gray-400 text-sm mb-2">Your Score</p>
                            <h2 className="text-4xl font-bold">
                                {score}
                            </h2>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-gray-400 text-sm">Questions</p>
                                <p className="text-xl font-semibold">{total}</p>
                            </div>

                            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <p className="text-gray-400 text-sm">Accuracy</p>
                                <p className="text-xl font-semibold">{percentage}%</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Back to Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    );
}