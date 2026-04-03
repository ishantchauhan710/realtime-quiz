import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";
import PageContainer from "./PageContainer";

export default function QuizStartPage() {
  const { id } = useParams();
  const quizId = Number(id);

  const navigate = useNavigate();
  const API = "http://localhost:3333";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 const createSession = async () => {
  try {
    const token = getToken();

    const start = Date.now(); // fake delay for ui smoothness

    const res = await fetch(API + "/sessions/solo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quizId }),
    });

    if (!res.ok) {
      throw new Error("Failed to start quiz");
    }

    const data = await res.json();

    const elapsed = Date.now() - start;
    const remaining = 1000 - elapsed; // 1s minimum loading time 

    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }

    navigate(`/session/${data.sessionId}`);
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!quizId) {
      setError("Invalid quiz");
      setLoading(false);
      return;
    }

    createSession();
  }, [quizId]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">

        {loading && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
            <h2 className="text-xl font-semibold">Starting Quiz...</h2>
            <p className="text-gray-400 text-sm">
              Setting up your session
            </p>
          </>
        )}

        {error && (
          <>
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Failed to start quiz
            </h2>

            <p className="text-gray-400 text-sm mb-4">{error}</p>

            <button
              onClick={createSession}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              Retry
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-3 text-gray-400 text-sm"
            >
              Go back
            </button>
          </>
        )}
      </div>
    </PageContainer>
  );
}