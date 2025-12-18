"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, ArrowRight, Upload } from "lucide-react"
import type { Topic } from "@/lib/types"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface TopicsViewProps {
    topics: Topic[]
    onGenerateQuiz: () => Promise<void>
    onNewDocument: () => void
}

export function TopicsView({ topics, onGenerateQuiz, onNewDocument }: TopicsViewProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        await onGenerateQuiz()
        setIsGenerating(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            {"AI Extracted"}
                        </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-balance">{"Extracted Topics"}</h2>
                    <p className="text-muted-foreground text-lg">
                        {"We found "}
                        {topics.length}
                        {" key topics in your document"}
                    </p>
                </div>
                <Button variant="outline" onClick={onNewDocument}>
                    <Upload className="w-4 h-4 mr-2" />
                    {"New Document"}
                </Button>
            </div>

            <div className="grid gap-4">
                {topics.map((topic, index) => (
                    <Card key={topic.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed ml-11">{topic.description}</CardDescription>
                                </div>
                                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="font-semibold text-lg">{"Ready to test your knowledge?"}</h3>
                            <p className="text-sm text-muted-foreground">{"Generate a personalized quiz based on these topics"}</p>
                        </div>
                        <Button size="lg" onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {"Generating Quiz..."}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {"Generate Quiz"}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
