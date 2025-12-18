"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock } from "lucide-react"

type QuizAttempt = {
    timestamp: string
    totalQuestions: number
    correctAnswers: number
    scorePercentage: number
}

interface QuizAttemptsProps {
    pdfId: string
}

export function QuizAttempts({ pdfId }: QuizAttemptsProps) {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/practice/attempts/${pdfId}`
        )
            .then((res) => res.json())
            .then((data) => setAttempts(data))
            .finally(() => setLoading(false))
    }, [pdfId])

    if (loading) {
        return <p className="text-muted-foreground">Loading attempt history…</p>
    }

    if (attempts.length === 0) {
        return <p className="text-muted-foreground">No previous attempts yet.</p>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Quiz Attempts
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {attempts.map((a, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between border rounded-lg p-3"
                    >
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                {new Date(a.timestamp).toLocaleString()}
              </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary">
                                {a.correctAnswers}/{a.totalQuestions}
                            </Badge>
                            <Badge>{a.scorePercentage}%</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
