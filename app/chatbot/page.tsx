"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your job post creator. Simply describe the job you want to post, and I'll send it directly to your n8n workflow. The AI agent in n8n will process your description and create the complete job posting. What position do you need to fill?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    } else if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages])

  const sendToN8n = async (jobDescription: string) => {
    try {
      console.log("[v0] Sending to local API route")

      const response = await fetch("/api/n8n-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: jobDescription,
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || `API returned ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (result.result) {
        // Handle different response formats from n8n
        if (typeof result.result === "string") {
          return result.result.trim()
        } else if (typeof result.result === "object") {
          // Extract the AI-generated job post from n8n response
          if (result.result.output && result.result.output.prompt) {
            return result.result.output.prompt
          } else if (result.result.prompt) {
            return result.result.prompt
          } else {
            // Fallback: stringify the object response
            return JSON.stringify(result.result, null, 2)
          }
        }
      } else if (result.success) {
        return "✅ Job post sent to n8n successfully! The AI agent is processing your request."
      } else {
        return "Job description processed, but no response received from n8n AI agent."
      }
    } catch (error) {
      console.error("[v0] Error sending to API:", error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      const n8nResult = await sendToN8n(userInput)
      const responseMessage: Message = {
        id: Date.now().toString(),
        content: n8nResult,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, responseMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `❌ Error: ${error instanceof Error ? error.message : "Failed to send to n8n"}\n\nPlease check:\n• Your n8n webhook URL is correct\n• Your n8n workflow is active\n• The webhook endpoint is responding`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto p-6 h-full">
            <div className="flex flex-col h-full max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-balance text-black">Job Post Creator</h2>
                <p className="text-gray-600">Describe your job opening and I'll send it to n8n for AI processing</p>
              </div>

              <Card className="flex-1 flex flex-col bg-white border-black border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Bot className="h-5 w-5" />
                    n8n Job Assistant
                    <Badge variant="secondary" className="ml-auto bg-black text-white">
                      Ready
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col min-h-0">
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 scroll-smooth"
                    style={{ maxHeight: "calc(100vh - 300px)" }}
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.sender === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === "user" ? "bg-black text-white" : "bg-gray-200 text-black"
                            }`}
                          >
                            {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div
                            className={`rounded-lg px-4 py-2 whitespace-pre-wrap ${
                              message.sender === "user"
                                ? "bg-black text-white"
                                : "bg-gray-100 text-black border border-gray-300"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-black">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-lg px-4 py-2 bg-gray-100 text-black border border-gray-300 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending to n8n...
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe the job you want to post (e.g., 'Need a senior developer, remote, $80k salary...')"
                      disabled={isLoading}
                      className="flex-1 bg-white border-black border-2 text-black placeholder:text-gray-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
