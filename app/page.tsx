"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Leaf, RefreshCw } from "lucide-react"
import { Container } from "@/components/container"
import { WeatherCard } from "@/components/weather-card"
import { AQICard } from "@/components/aqi-card"
import { RiskScoreCard } from "@/components/risk-score-card"
import { SuggestionList, mockSuggestions } from "@/components/suggestion-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would come from an API
const mockWeatherData = {
  temperature: 28,
  humidity: 65,
  condition: "sunny" as const,
  windSpeed: 14,
}

const mockAQIData = {
  value: 142,
  trend: "up" as const,
}

const mockRiskData = {
  score: 58,
  reason: "Elevated PM2.5 levels may affect sensitive groups. Consider limiting outdoor activities.",
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function Home() {
  const [userName, setUserName] = useState("Arvind")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Load user name from localStorage
    const savedProfile = localStorage.getItem("atmosai-profile")
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        if (profile.name) {
          setUserName(profile.name)
        }
      } catch {
        console.error("Failed to parse profile")
      }
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen">
      <Container className="py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                  Live Data
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {getGreeting()}, <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{userName}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate()}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  New Delhi, India
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WeatherCard {...mockWeatherData} />
          <AQICard {...mockAQIData} />
          <RiskScoreCard {...mockRiskData} />
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-emerald-100">PM2.5</p>
            <p className="mt-1 text-3xl font-bold">85 µg/m³</p>
            <p className="mt-2 text-xs text-emerald-200">Above safe limit</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-teal-500 to-teal-600 p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-teal-100">PM10</p>
            <p className="mt-1 text-3xl font-bold">142 µg/m³</p>
            <p className="mt-2 text-xs text-teal-200">Moderate level</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-cyan-100">Ozone</p>
            <p className="mt-1 text-3xl font-bold">38 ppb</p>
            <p className="mt-2 text-xs text-cyan-200">Within safe range</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-green-100">UV Index</p>
            <p className="mt-1 text-3xl font-bold">6</p>
            <p className="mt-2 text-xs text-green-200">High - Use protection</p>
          </div>
        </div>

        {/* Suggestions Section */}
        <SuggestionList suggestions={mockSuggestions} />
      </Container>
    </div>
  )
}
