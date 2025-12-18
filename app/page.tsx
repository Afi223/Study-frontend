"use client"

import { useState } from "react"
import { UploadCard } from "@/components/upload-card"
import { QuizView } from "@/components/quiz-view"
import { Brain } from "lucide-react"
import { QuizAttempts } from "@/components/quiz-attempts"


export type QuizQuestion = {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    userAnswer?: number
}

export default function Home() {
    const [step, setStep] = useState<"upload" | "quiz">("upload")
    const [pdfId, setPdfId] = useState<string | null>(null)
    const [quiz, setQuiz] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(false)

    // 1️⃣ Upload PDF to backend
    const handleFileUpload = async (file: File) => {
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pdf/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!res.ok) {
                throw new Error("PDF upload failed")
            }

            const data = await res.json()
            setPdfId(data.pdfId)
        } catch (err) {
            alert("Failed to upload PDF")
        } finally {
            setLoading(false)
        }
    }

    // 2️⃣ Generate quiz from uploaded PDF
    const handleGenerateQuiz = async () => {
        if (!pdfId) return

        setLoading(true)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/practice/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pdfId }),
                }
            )

            if (!res.ok) {
                throw new Error("Quiz generation failed")
            }

            const data = await res.json()
            setQuiz(data)
            setStep("quiz")
        } catch (err) {
            alert("Failed to generate quiz")
        } finally {
            setLoading(false)
        }
    }
    const handleRestartQuiz = () => {
        setQuiz((prev) =>
            prev.map((q) => ({ ...q, userAnswer: undefined }))
        )
    }

    const handleBackToUpload = () => {
        setQuiz([])
        setPdfId(null)
        setStep("upload")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-semibold">AI Study Planner</h1>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {step === "upload" && (
                    <UploadCard
                        onUpload={handleFileUpload}
                        onGenerateQuiz={handleGenerateQuiz}
                        loading={loading}
                        pdfReady={!!pdfId}
                    />
                )}

                {step === "quiz" && pdfId && (
                    <div className="space-y-6">
                        {/* ✅ Attempt history */}
                        <QuizAttempts pdfId={pdfId} />

                        {/* ✅ Quiz itself */}
                        <QuizView
                            quiz={quiz}
                            setQuiz={setQuiz}
                            onRestartQuiz={handleRestartQuiz}
                            onBackToTopics={handleBackToUpload}
                        />
                    </div>
                )}

            </main>
        </div>
    )
}
