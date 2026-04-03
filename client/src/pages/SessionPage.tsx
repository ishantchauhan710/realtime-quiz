import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";
import PageContainer from "./PageContainer";

export default function SessionPage() {
    const { id } = useParams();
    const sessionId = Number(id);

    const API = "http://localhost:3333";
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState<any>(null);
    const [index, setIndex] = useState(0);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [selected, setSelected] = useState<number | null>(null);
    const [correctOption, setCorrectOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const [timeLeft, setTimeLeft] = useState(10); // Default 10s

    // Timer
    useEffect(() => {
        if (!question) return;

        setTimeLeft(10);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [question]);

    const handleTimeout = async () => {
        if (submitting) return;
        await submitAnswer(-1); // no answer
    };

    // Fetch question
    const fetchQuestion = async () => {
        try {
            const token = getToken();

            const res = await fetch(
                API + `/sessions/${sessionId}/question`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.finished) {
                navigate(`/result/${sessionId}`);
                return;
            }

            if (data.expired) {
                setError("Session expired");
                setLoading(false);
                return;
            }

            setQuestion(data.question);
            setIndex(data.index);

            // reset UI state
            setSelected(null);
            setCorrectOption(null);
        } catch (err) {
            setError("Failed to load question");
        } finally {
            setLoading(false);
        }
    };

    // Submit answer
    const submitAnswer = async (optionIndex: number) => {
        if (submitting) return;

        setSubmitting(true);
        setSelected(optionIndex);

        try {
            const token = getToken();

            const res = await fetch(
                API + `/sessions/${sessionId}/answer`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ selectedOption: optionIndex }),
                }
            );

            const data = await res.json();

            setCorrectOption(data.correctOption);
            setScore(data.score);

            // show result before next
            await new Promise((r) => setTimeout(r, 1000));

            if (data.finished) {
                navigate(`/result/${sessionId}`);
                return;
            }

            await fetchQuestion();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            const confirmLeave = window.confirm(
                "Going back will end your quiz. Continue?"
            );

            if (confirmLeave) {
                setError("Session expired");
                setQuestion(null);
            } else {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.history.pushState(null, "", window.location.href);

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        if (!sessionId) {
            setError("Invalid session");
            setLoading(false);
            return;
        }

        fetchQuestion();
    }, [sessionId]);

    // Option styling
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

    return (
        <PageContainer>
            <div className="max-w-2xl mx-auto">

                {/* 🔝 Header */}
                {!error && (<div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Question {index + 1}</span>
                        <span>Score: {score}</span>
                    </div>

                    {/* 📊 Progress Bar */}
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-white h-full transition-all"
                            style={{ width: `${(timeLeft / 10) * 100}%` }}
                        />
                    </div>

                    <div className="text-right text-xs text-gray-500 mt-1">
                        {timeLeft}s
                    </div>
                </div>)}

                {/* Loading */}
                {loading && (
                    <div className="text-center mt-20">
                        <div className="animate-spin h-10 w-10 border-b-2 border-white mx-auto mb-4" />
                        <p className="text-gray-400">Loading question...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center mt-20">
                        <h2 className="text-xl font-semibold text-red-400 mb-3">
                            Session Invalid
                        </h2>

                        <p className="text-gray-400 text-sm mb-4">
                            This quiz session has already been completed or is invalid.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="bg-white text-black px-4 py-2 rounded-lg"
                        >
                            Go Home
                        </button>
                    </div>
                )}

                {/* Question */}
                {!loading && question && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6">
                            Q{index + 1}. {question.questionText}
                        </h2>

                        {/* Options */}
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
        </PageContainer>
    );
}