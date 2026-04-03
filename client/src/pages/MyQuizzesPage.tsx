import { useEffect, useState } from "react"
import { getToken } from "../lib/auth"
import { useNavigate } from "react-router-dom"
import PageContainer from "./PageContainer"

export default function MyQuizzesPage() {
  const API = "http://localhost:3333"
  const navigate = useNavigate()

  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ================= FETCH =================
  const fetchQuizzes = async () => {
    try {
      const token = getToken()

      const res = await fetch(API + "/my-quizzes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setQuizzes(data)
    } catch (err) {
      console.error("Fetch quizzes error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this quiz?")

    if (!confirmDelete) return

    try {
      const token = getToken()

      await fetch(API + `/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // remove from UI instantly
      setQuizzes((prev) => prev.filter(q => q.id !== id))

    } catch (err) {
      console.error("Delete error", err)
      alert("Failed to delete quiz")
    }
  }

  // ================= UI =================
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Quizzes</h1>

          <button
            onClick={() => navigate("/quiz-builder")}
            className="bg-green-600 px-4 py-2 rounded"
          >
            + Create Quiz
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-400">No quizzes found</p>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

  {/* HEADER */}
  <div className="grid grid-cols-12 px-4 py-3 text-xs text-gray-400 border-b border-zinc-800">
    <div className="col-span-4">Quiz</div>
    <div className="col-span-2 text-center">Questions</div>
    <div className="col-span-2 text-center">Time</div>
    <div className="col-span-2 text-center">Type</div>
    <div className="col-span-2 text-right">Actions</div>
  </div>

  {/* BODY */}
  {quizzes.map((quiz) => (
    <div
      key={quiz.id}
      className="grid grid-cols-12 items-center px-4 py-3 border-b border-zinc-800 last:border-none hover:bg-zinc-800/40 transition"
    >
      {/* TITLE */}
      <div className="col-span-4">
        <p className="font-medium">{quiz.title}</p>
        <p className="text-xs text-gray-400 truncate">
          {quiz.description || "No description"}
        </p>
      </div>

      {/* QUESTIONS */}
      <div className="col-span-2 text-center text-sm">
        {quiz.totalQuestions}
      </div>

      {/* TIME */}
      <div className="col-span-2 text-center text-sm">
        {quiz.timePerQuestion}s
      </div>

      {/* TYPE */}
      <div className="col-span-2 text-center">
        {quiz.isDefault ? (
          <span className="text-xs bg-yellow-600 px-2 py-1 rounded">
            Default
          </span>
        ) : (
          <span className="text-xs bg-blue-600 px-2 py-1 rounded">
            Custom
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className="col-span-2 flex justify-end gap-2">

        {!quiz.isDefault && (
          <button
            onClick={() => navigate(`/quiz-builder?id=${quiz.id}`)}
            className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}

        {/* {!quiz.isDefault && (
          <button
            onClick={() => handleDelete(quiz.id)}
            className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )} */}

      </div>
    </div>
  ))}
</div>
        )}
      </div>
    </PageContainer>
  )
}