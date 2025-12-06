"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Container } from "@/components/container"
import { useEnvironmentalData } from "@/hooks/use-environmental-data"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useSession } from "@/components/session-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function HealthAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your personalized health assistant. I can provide advice based on your health profile and current environmental conditions. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isLoading: sessionLoading, isAuthenticated } = useSession()
  const router = useRouter()
  const { location: geoLocation, isLoading: geoLoading } = useGeolocation()

  const {
    weather,
    aqi,
    isLoadingWeather,
    isLoadingSuggestions,
    error: envError,
    refresh,
  } = useEnvironmentalData(
    geoLocation ? `${geoLocation.city ?? ""}, ${geoLocation.state ?? ""}, ${geoLocation.country ?? ""}` : null,
    user
      ? {
          age: (user as any).age,
          pastIllness: (user as any).pastIllness,
          habits: (user as any).habits,
        }
      : undefined,
    geoLocation
      ? {
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
        }
      : null,
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      toast.error("Please log in to use the health assistant")
      router.push("/login")
    }
  }, [isAuthenticated, sessionLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          userProfile: user,
          environmentalData:
            weather || aqi
              ? {
                  weather,
                  aqi,
                }
              : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to get response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <div className="">
      <Navbar />
      <div className="bg-linear-to-br py-8 overflow-y-hidden from-white via-emerald-50/30 to-white">
        <Container className="">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Health Assistant</h1>
                  <p className="text-sm text-gray-500">AI-powered personalized health advice</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>

            {/* Chat Container */}
            <div className="rounded-2xl bg-white border shadow-xl overflow-hidden">
              {/* Messages */}
              <div className="h-[calc(100vh-20rem)] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === "user"
                          ? "rounded-tr-none bg-linear-to-br from-primary to-secondary text-white"
                          : "rounded-tl-none bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4 bg-gray-50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your health, air quality, or get personalized advice..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                {(isLoadingWeather || isLoadingSuggestions || geoLoading) && (
                  <p className="text-xs text-gray-500 mt-2">Loading environmental data...</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
