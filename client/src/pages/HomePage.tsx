import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";
import PageContainer from "./PageContainer";
import { useNavigate } from "react-router-dom";

export default function Home({ setUser }: any) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(true);

  const API = "http://localhost:3333";
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = getToken();

    await fetch(API + "/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = getToken();

        const res = await fetch(API + "/quizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

    
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <PageContainer onLogout={handleLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Play Solo</h1>
        <p className="text-gray-400 text-sm">
          Test your knowledge with different quizzes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quizLoading ? (
          <p className="text-gray-400">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-400">No quizzes available</p>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 hover:border-zinc-600 transition cursor-pointer"
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h2>

              <p className="text-sm text-gray-400 mb-3">
                {quiz.description || "No description"}
              </p>

              <div className="text-xs text-gray-500 mb-4">
                {quiz.totalQuestions} questions •{" "}
                {quiz.timePerQuestion}s each
              </div>

              <button
                className="w-full bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                onClick={(e) => {
                  e.stopPropagation(); 
                  navigate(`/quiz/${quiz.id}`);
                }}
              >
                Start Quiz
              </button>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
}