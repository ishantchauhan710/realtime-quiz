import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getToken } from "../lib/auth"
import PageContainer from "./PageContainer"

export default function QuizBuilderPage() {
  const API = "http://localhost:3333"

  const [searchParams] = useSearchParams()
  const quizId = searchParams.get("id")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [questions, setQuestions] = useState<any[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ])

  const [loading, setLoading] = useState(!!quizId)
  const [notFound, setNotFound] = useState(false)

  // ================= FETCH (EDIT MODE) =================

  useEffect(() => {
    if (!quizId) return

    const fetchQuiz = async () => {
      try {
        const token = getToken()

        const res = await fetch(`${API}/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 404) {
          setNotFound(true)
          return
        }

        const data = await res.json()

        setTitle(data.title)
        setDescription(data.description)

        setQuestions(
          data.questions.map((q: any) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
          }))
        )

      } catch (err) {
        console.error(err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  // ================= QUESTION =================

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  // ================= VALIDATION =================

  const validate = () => {
    if (!title.trim()) return "Title is required"
    if (!description.trim()) return "Description is required"

    if (questions.length < 3) {
      return "Minimum 3 questions required"
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]

      if (!q.questionText.trim()) {
        return `Question ${i + 1} is empty`
      }

      if (q.options.length !== 4) {
        return `Question ${i + 1} must have exactly 4 options`
      }

      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          return `Option ${j + 1} in Question ${i + 1} is empty`
        }
      }

      if (
        q.correctOption === null ||
        q.correctOption === undefined
      ) {
        return `Select correct answer for Question ${i + 1}`
      }
    }

    return null
  }

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    const error = validate()

    if (error) {
      alert(error)
      return
    }

    try {
      const token = getToken()

      const payload = {
        title,
        description,
        timePerQuestion: 10,
        questions,
      }

      const url = quizId
        ? `${API}/quizzes/${quizId}`
        : `${API}/quizzes`

      const method = quizId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed")

      alert(quizId ? "Quiz Updated ✅" : "Quiz Created ✅")

    } catch (err) {
      console.error(err)
      alert("Error saving quiz")
    }
  }

  // ================= UI STATES =================

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center mt-20 text-gray-400">
          Loading...
        </div>
      </PageContainer>
    )
  }

  if (notFound) {
    return (
      <PageContainer>
        <div className="text-center mt-20">
          <h2 className="text-xl text-red-400">
            Quiz not found (404)
          </h2>
        </div>
      </PageContainer>
    )
  }

  // ================= UI =================

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          {quizId ? "Edit Quiz" : "Create Quiz"}
        </h1>

        {/* QUIZ INFO */}
        <div className="space-y-3 mb-6">
          <input
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg"
          />
        </div>

        {/* QUESTIONS */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 border border-zinc-700 rounded-lg"
            >
              <div className="flex justify-between mb-3">
                <h2>Question {qIndex + 1}</h2>

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* QUESTION TEXT */}
              <input
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) =>
                  updateQuestion(qIndex, "questionText", e.target.value)
                }
                className="w-full p-2 mb-3 bg-zinc-900 border border-zinc-700 rounded"
              />

              {/* OPTIONS */}
              {q.options.map((opt: string, oIndex: number) => (
                <div key={oIndex} className="flex gap-2 mb-2">

                  <input
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded"
                  />

                  <input
                    type="radio"
                    checked={q.correctOption === oIndex}
                    onChange={() =>
                      updateQuestion(qIndex, "correctOption", oIndex)
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={addQuestion}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            + Add Question
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 px-4 py-2 rounded"
          >
            {quizId ? "Update Quiz" : "Save Quiz"}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}