import { useEffect, useState } from "react";
import { API } from "../lib/api";
import { getToken } from "../lib/auth";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<string | null>(null);
    const [correct, setCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(10);

    const startQuiz = async () => {
        const res = await fetch(API + "/sessions/solo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify({ quizId: id }),
        });

        const data = await res.json();

        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setLoading(false);
    };

    useEffect(() => {
        if (id) startQuiz();
    }, [id]);

    useEffect(() => {
        if (!questions.length || index === -1) return;

        if (timeLeft === 0) {
            handleAnswer(null);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, questions, index]);

    const handleAnswer = async (optionText: string | null) => {
        if (!sessionId || index === -1) return;

        setSelected(optionText);

        const res = await fetch(API + `/sessions/${sessionId}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify({ answer: optionText }),
        });

        const data = await res.json();

        setCorrect(data.correct);
        setScore(data.score);

        setTimeout(() => {
            if (data.finished) {
                // navigate("/home");
                setIndex(-1);
                return;
            }

            setSelected(null);
            setCorrect(null);
            setTimeLeft(10);
            setIndex(data.nextQuestionIndex);
        }, 800);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="animate-pulse text-lg">Starting Quiz...</div>
            </div>
        );
    }

    if (index === -1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="bg-gray-900 p-8 rounded-2xl text-center shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Quiz Finished 🎉</h2>
                    <p className="text-lg mb-6">Score: {score}</p>
                    <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-2 bg-white text-black rounded-lg hover:opacity-90 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const q = questions[index];
    const progress = ((index + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 shadow-xl">

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>
                            Question {index + 1} / {questions.length}
                        </span>
                        <span>⏱ {timeLeft}s</span>
                    </div>

                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-6 leading-relaxed">
                    {q.question}
                </h2>

                <div className="space-y-3">
                    {q.options.map((opt: any) => {
                        let styles =
                            "bg-gray-800 hover:bg-gray-700 border border-gray-700";

                        if (selected === opt.text) {
                            styles = correct
                                ? "bg-green-600 border-green-500"
                                : "bg-red-600 border-red-500";
                        }

                        return (
                            <button
                                key={opt.id}
                                disabled={selected !== null}
                                onClick={() => handleAnswer(opt.text)}
                                className={`w-full p-4 rounded-xl text-left transition ${styles}`}
                            >
                                {opt.text}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                    <span>Score: {score}</span>
                    <span>Session #{sessionId}</span>
                </div>
            </div>
        </div>
    );
}