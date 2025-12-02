"use client"

import { useState, useCallback, useEffect } from "react"

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy"
  conditionDescription: string
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
}

interface AQIData {
  value: number
  category: string
  pm25: number
  pm10: number
  ozone: number
  no2: number
  so2: number
  co: number
}

interface Suggestion {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  icon: "exercise" | "mask" | "windows" | "hydration" | "indoor" | "air"
}

interface RiskScore {
  score: number
  reason: string
}

interface HealthRisk {
  id: string
  condition: string
  risk: "low" | "medium" | "high"
  description: string
}

interface UserProfile {
  age?: number
  pastIllness?: string[]
  habits?: {
    smoking?: boolean
    exercise_level?: string
    outdoor_exposure?: string
    mask_usage?: string
  }
}

interface Coordinates {
  latitude: number
  longitude: number
}

interface EnvironmentalData {
  weather: WeatherData | null
  aqi: AQIData | null
  suggestions: Suggestion[]
  riskScore: RiskScore | null
  healthRisks: HealthRisk[]
  isLoadingWeather: boolean
  isLoadingSuggestions: boolean
  error: string | null
}

export function useEnvironmentalData(
  location: string | null, 
  userProfile?: UserProfile,
  coordinates?: Coordinates | null
) {
  const [data, setData] = useState<EnvironmentalData>({
    weather: null,
    aqi: null,
    suggestions: [],
    riskScore: null,
    healthRisks: [],
    isLoadingWeather: false,
    isLoadingSuggestions: false,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (!location && !coordinates) return

    setData((prev) => ({ ...prev, isLoadingWeather: true, isLoadingSuggestions: true, error: null }))

    try {
      // Build the URL - prefer coordinates if available
      let weatherUrl = "/api/weather?"
      if (coordinates) {
        weatherUrl += `lat=${coordinates.latitude}&lon=${coordinates.longitude}`
      } else if (location) {
        weatherUrl += `location=${encodeURIComponent(location)}`
      }

      // Fetch weather and AQI data first
      const weatherResponse = await fetch(weatherUrl)
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}))
        console.error("Weather API error:", weatherResponse.status, errorData)
        throw new Error(errorData.error || `Failed to fetch weather data (${weatherResponse.status})`)
      }

      const weatherData = await weatherResponse.json()

      // Update weather data immediately and show it
      setData((prev) => ({
        ...prev,
        weather: weatherData.weather,
        aqi: weatherData.aqi,
        isLoadingWeather: false,
      }))

      // Now fetch AI-powered suggestions (in background)
      const suggestionsResponse = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weather: weatherData.weather,
          aqi: weatherData.aqi,
          userProfile,
        }),
      })

      let suggestions: Suggestion[] = []
      let riskScore: RiskScore | null = null
      let healthRisks: HealthRisk[] = []

      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json()
        suggestions = suggestionsData.suggestions || []
        riskScore = suggestionsData.riskScore || null
        healthRisks = suggestionsData.healthRisks || []
      }

      setData((prev) => ({
        ...prev,
        suggestions,
        riskScore,
        healthRisks,
        isLoadingSuggestions: false,
      }))
    } catch (error) {
      console.error("Error fetching environmental data:", error)
      setData((prev) => ({
        ...prev,
        isLoadingWeather: false,
        isLoadingSuggestions: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [location, userProfile, coordinates])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (location || coordinates) {
      fetchData()
    }
  }, [location, coordinates, fetchData])

  return {
    ...data,
    refresh,
  }
}
