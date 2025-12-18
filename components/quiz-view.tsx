"use client"

import { useState, useMemo } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
    CheckCircle2,
    XCircle,
    RotateCcw,
    ArrowLeft,
    Trophy,
    Target,
} from "lucide-react"

import type { QuizQuestion } from "@/app/page"

interface QuizViewProps {
    quiz: QuizQuestion[]
    setQuiz: React.Dispatch<React.SetStateAction<QuizQuestion[]>>
    onRestartQuiz: () => void
    onBackToTopics: () => void
}

export function QuizView({
                             quiz,
                             setQuiz,
                             onRestartQuiz,
                             onBackToTopics,
                         }: QuizViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showExplanation, setShowExplanation] = useState(false)

    const currentQuestion = quiz[currentIndex]
    const hasAnswered = currentQuestion.userAnswer !== undefined
    const isCorrect = currentQuestion.userAnswer === currentQuestion.correctAnswer

    const stats = useMemo(() => {
        const answered = quiz.filter(q => q.userAnswer !== undefined).length
        const correct = quiz.filter(q => q.userAnswer === q.correctAnswer).length
        const progress = (answered / quiz.length) * 100
        const score = answered > 0 ? Math.round((correct / answered) * 100) : 0

        return {
            answered,
            correct,
            progress,
            score,
            total: quiz.length,
        }
    }, [quiz])

    const handleAnswer = (optionIndex: number) => {
        if (hasAnswered) return

        setQuiz(prev =>
            prev.map((q, i) =>
                i === currentIndex ? { ...q, userAnswer: optionIndex } : q
            )
        )

        setShowExplanation(optionIndex !== currentQuestion.correctAnswer)
    }

    const handleNext = () => {
        if (currentIndex < quiz.length - 1) {
            setCurrentIndex(i => i + 1)
            setShowExplanation(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1)
            const prevQuestion = quiz[currentIndex - 1]
            setShowExplanation(
                prevQuestion.userAnswer !== undefined &&
                prevQuestion.userAnswer !== prevQuestion.correctAnswer
            )
        }
    }

    const isQuizComplete = stats.answered === stats.total

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Practice Quiz</h2>
                    <p className="text-muted-foreground">
                        Question {currentIndex + 1} of {quiz.length}
                    </p>
                </div>

                <Button variant="outline" onClick={onBackToTopics}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Progress */}
            <Card>
                <CardHeader>
                    <div className="space-y-3">
                        <div className="flex justify-between flex-wrap gap-3">
                            <Badge variant="secondary">
                                <Target className="w-3 h-3 mr-1" />
                                {stats.answered}/{stats.total} answered
                            </Badge>

                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{stats.score}%</span>
                                <span className="text-sm text-muted-foreground">
                  ({stats.correct}/{stats.answered})
                </span>
                            </div>
                        </div>

                        <Progress value={stats.progress} />
                    </div>
                </CardHeader>
            </Card>

            {/* Question */}
            <Card>
                <CardHeader>
                    <CardTitle>{currentQuestion.question}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const selected = currentQuestion.userAnswer === index
                        const correct = index === currentQuestion.correctAnswer

                        const showCorrect = hasAnswered && correct
                        const showWrong = hasAnswered && selected && !correct

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={hasAnswered}
                                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                                    showCorrect
                                        ? "border-green-500 bg-green-50"
                                        : showWrong
                                            ? "border-red-500 bg-red-50"
                                            : selected
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{option}</span>
                                    {showCorrect && <CheckCircle2 className="text-green-600" />}
                                    {showWrong && <XCircle className="text-red-600" />}
                                </div>
                            </button>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Explanation */}
            {hasAnswered && (
                <Alert variant={isCorrect ? "default" : "destructive"}>
                    <AlertTitle>
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </AlertTitle>
                    <AlertDescription>
                        {currentQuestion.explanation}
                    </AlertDescription>
                </Alert>
            )}

            {/* Controls */}
            <div className="flex justify-between flex-wrap gap-3">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </Button>

                <div className="flex gap-3">
                    {isQuizComplete && (
                        <Button variant="outline" onClick={onRestartQuiz}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restart
                        </Button>
                    )}

                    <Button
                        onClick={handleNext}
                        disabled={currentIndex === quiz.length - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

