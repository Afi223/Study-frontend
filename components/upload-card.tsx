"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, Sparkles } from "lucide-react"

interface UploadCardProps {
    onUpload: (file: File) => void
    onGenerateQuiz: () => void
    loading: boolean
    pdfReady: boolean
}

export function UploadCard({
                               onUpload,
                               onGenerateQuiz,
                               loading,
                               pdfReady,
                           }: UploadCardProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type === "application/pdf") {
            setSelectedFile(file)
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === "application/pdf") {
            setSelectedFile(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        await onUpload(selectedFile)
        setIsUploading(false)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Upload Your Study Material</h2>
                <p className="text-muted-foreground text-lg">
                    Transform any PDF into AI-generated practice quizzes
                </p>
            </div>

            <Card className="border-2 border-dashed transition-colors">
                <CardHeader>
                    <CardTitle>Upload PDF Document</CardTitle>
                    <CardDescription>
                        Drag and drop your study material or click to browse
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                            isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/5"
                        }`}
                    >
                        {selectedFile ? (
                            <div className="space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>

                                <div>
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>

                                <div className="flex gap-3 justify-center flex-wrap">
                                    <Button onClick={handleUpload} disabled={isUploading} size="lg">
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing…
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Process PDF
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={isUploading}
                                        onClick={() => setSelectedFile(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                {pdfReady && (
                                    <div className="pt-4">
                                        <Button
                                            onClick={onGenerateQuiz}
                                            disabled={loading}
                                            size="lg"
                                            className="w-full"
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Quiz
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>

                                <div>
                                    <p className="text-lg font-medium mb-1">
                                        Drop your PDF here
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        or click to browse your files
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />

                                <label htmlFor="file-upload">
                                    <Button variant="outline" size="lg" asChild>
                                        <span className="cursor-pointer">Choose File</span>
                                    </Button>
                                </label>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
