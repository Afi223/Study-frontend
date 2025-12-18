import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "AI Study Planner",
    description: "Upload PDFs and generate AI-powered practice quizzes",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
        {children}
        </body>
        </html>
    )
}
