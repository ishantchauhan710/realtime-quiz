import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";
import PageContainer from "./PageContainer";
import { API } from "../lib/api";

export default function Home() {

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {

      const token = getToken();
      const res = await fetch(API + "/quizzes", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();

      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleLogout = async () => {
    const token = getToken();

    await fetch(API + "/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clearToken();
    window.location.href = "/";
  };

  if (quizLoading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }


  return (<PageContainer onLogout={handleLogout}>
    <div className="mb-8">
      <h1 className="text-3xl font-semibold">Home</h1>
      <p className="text-gray-400 text-sm">Play Quiz</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizLoading ? (
        <div className="text-gray-400">Loading quizzes...</div>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-gray-800 to-gray-700 hover:from-white/20 hover:to-white/10 transition-all duration-300"
          >
            {/* Inner Card */}
            <div className="h-full bg-gray-950 rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300">

              {/* Top */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {quiz.title}
                </h2>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {quiz.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  {quiz.timeLimit && (
                    <span>⏱ {quiz.timeLimit} sec</span>
                  )}
                </div>
              </div>

              {/* Button */}
              <button
                className="mt-6 w-full py-2.5 rounded-xl cursor-pointer bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all"
                onClick={() => {
                  console.log("Start quiz", quiz.id);
                }}
              >
                Start Quiz →
              </button>
            </div>
          </div>
        ))
      )}
    </div>

  </PageContainer>
  );
}