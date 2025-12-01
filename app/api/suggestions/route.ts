import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface WeatherData {
  temperature: number
  humidity: number
  condition: string
  conditionDescription: string
  windSpeed: number
  uvIndex: number
}

interface AQIData {
  value: number
  category: string
  pm25: number
  pm10: number
  ozone: number
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

interface SuggestionsRequest {
  weather: WeatherData
  aqi: AQIData
  userProfile?: UserProfile
}

type IconType = "exercise" | "mask" | "windows" | "hydration" | "indoor" | "air"
type PriorityType = "low" | "medium" | "high"

export async function POST(request: NextRequest) {
  try {
    const body: SuggestionsRequest = await request.json()
    const { weather, aqi, userProfile } = body

    if (!weather || !aqi) {
      return NextResponse.json(
        { error: "Weather and AQI data are required" },
        { status: 400 }
      )
    }

    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      console.log("Gemini API key not configured, using fallback suggestions")
      return NextResponse.json(getFallbackSuggestions(weather, aqi, userProfile))
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(geminiApiKey)

    // Build the prompt
    const userHealthContext = userProfile ? `
User Health Profile:
- Age: ${userProfile.age || "Not specified"}
- Health Conditions: ${userProfile.pastIllness?.length ? userProfile.pastIllness.join(", ") : "None specified"}
- Smoker: ${userProfile.habits?.smoking ? "Yes" : "No"}
- Exercise Level: ${userProfile.habits?.exercise_level || "Medium"}
- Outdoor Exposure: ${userProfile.habits?.outdoor_exposure || "Moderate"}
- Mask Usage: ${userProfile.habits?.mask_usage || "Sometimes"}
` : ""

    const prompt = `You are an AI health advisor for AtmosAI, an air quality monitoring app. Based on the current environmental conditions and user health profile, provide personalized health recommendations.

Current Environmental Conditions:
- Temperature: ${weather.temperature}°C (${weather.conditionDescription})
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h
- UV Index: ${weather.uvIndex}
- Air Quality Index (AQI): ${aqi.value} (${aqi.category})
- PM2.5: ${aqi.pm25} µg/m³
- PM10: ${aqi.pm10} µg/m³
- Ozone: ${aqi.ozone} µg/m³
${userHealthContext}

Provide exactly 4-5 actionable health recommendations specific to the current conditions.

Priority guidelines:
- high: AQI > 150 or conditions dangerous for user's health profile
- medium: AQI 100-150 or moderate health concerns
- low: AQI < 100 or general wellness tips

For the riskScore, calculate a score from 0-100 based on AQI level, weather conditions, and user's health vulnerabilities.

For healthRisks, identify 2-4 specific health conditions that may be affected (e.g., Respiratory Health, Cardiovascular Health, Allergies, Skin Health).

Icon options: exercise, mask, windows, hydration, indoor, air

Respond with ONLY valid JSON in this exact format:
{
  "suggestions": [
    { "id": "1", "title": "Short title", "description": "Description", "priority": "low|medium|high", "icon": "exercise|mask|windows|hydration|indoor|air" }
  ],
  "riskScore": { "score": 0-100, "reason": "Explanation" },
  "healthRisks": [
    { "id": "1", "condition": "Condition name", "risk": "low|medium|high", "description": "Description" }
  ]
}`

    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          responseMimeType: "application/json",
        },
      })

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      if (!text) {
        console.error("No response text from Gemini")
        return NextResponse.json(getFallbackSuggestions(weather, aqi, userProfile))
      }

      // Clean up the response if needed
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3)
      }

      const parsedResponse = JSON.parse(cleanedText.trim())
      return NextResponse.json(parsedResponse)
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError)
      return NextResponse.json(getFallbackSuggestions(weather, aqi, userProfile))
    }
  } catch (error) {
    console.error("Suggestions API error:", error)
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    )
  }
}

// Fallback suggestions when API fails
function getFallbackSuggestions(weather: WeatherData, aqi: AQIData, userProfile?: UserProfile) {
  const isHighRisk = aqi.value > 150
  const isMediumRisk = aqi.value > 100
  const hasRespiratoryConditions = userProfile?.pastIllness?.some(
    (illness) => ["asthma", "copd", "bronchitis", "respiratory"].some(
      (condition) => illness.toLowerCase().includes(condition)
    )
  )

  const suggestions: Array<{
    id: string
    title: string
    description: string
    priority: PriorityType
    icon: IconType
  }> = [
    {
      id: "1",
      title: "Monitor Air Quality",
      description: `Current AQI is ${aqi.value} (${aqi.category}). Stay informed about changes throughout the day.`,
      priority: isHighRisk ? "high" : isMediumRisk ? "medium" : "low",
      icon: "air",
    },
    {
      id: "2",
      title: "Stay Hydrated",
      description: `With ${weather.humidity}% humidity and ${weather.temperature}°C, drink plenty of water to maintain good health.`,
      priority: "low",
      icon: "hydration",
    },
  ]

  if (isHighRisk || hasRespiratoryConditions) {
    suggestions.push({
      id: "3",
      title: "Wear Protective Mask",
      description: "Use an N95 mask when going outside to protect against harmful particles.",
      priority: "high",
      icon: "mask",
    })
    suggestions.push({
      id: "4",
      title: "Limit Outdoor Activities",
      description: "Consider staying indoors and reducing physical exertion until air quality improves.",
      priority: "high",
      icon: "indoor",
    })
  } else if (isMediumRisk) {
    suggestions.push({
      id: "3",
      title: "Reduce Outdoor Exercise",
      description: "Consider lighter activities or exercise indoors during peak pollution hours.",
      priority: "medium",
      icon: "exercise",
    })
    suggestions.push({
      id: "4",
      title: "Keep Windows Closed",
      description: "Close windows during peak pollution hours to maintain indoor air quality.",
      priority: "medium",
      icon: "windows",
    })
  } else {
    suggestions.push({
      id: "3",
      title: "Enjoy Outdoor Activities",
      description: "Air quality is good for outdoor activities. Great time for a walk or exercise!",
      priority: "low",
      icon: "exercise",
    })
    suggestions.push({
      id: "4",
      title: "Ventilate Your Space",
      description: "Good time to open windows and let fresh air circulate in your home.",
      priority: "low",
      icon: "windows",
    })
  }

  if (weather.uvIndex > 6) {
    suggestions.push({
      id: "5",
      title: "Sun Protection Needed",
      description: `UV Index is ${weather.uvIndex}. Apply sunscreen and wear protective clothing if going outside.`,
      priority: weather.uvIndex > 8 ? "high" : "medium",
      icon: "indoor",
    })
  }

  return {
    suggestions: suggestions.slice(0, 5),
    riskScore: {
      score: Math.min(Math.round(aqi.value * 0.5 + (hasRespiratoryConditions ? 20 : 0)), 100),
      reason: `Based on AQI of ${aqi.value} (${aqi.category})${hasRespiratoryConditions ? " and your respiratory health history" : ""}`,
    },
    healthRisks: [
      {
        id: "1",
        condition: "Respiratory Health",
        risk: (isHighRisk ? "high" : isMediumRisk ? "medium" : "low") as PriorityType,
        description: `Current air quality may ${isHighRisk ? "significantly affect" : isMediumRisk ? "moderately affect" : "not significantly impact"} breathing.`,
      },
      {
        id: "2",
        condition: "Cardiovascular Health",
        risk: (isHighRisk ? "medium" : "low") as PriorityType,
        description: `Air pollution can ${isHighRisk ? "impact" : "have minimal effect on"} heart health.`,
      },
      {
        id: "3",
        condition: "Allergies",
        risk: (aqi.pm10 > 50 ? "medium" : "low") as PriorityType,
        description: `PM10 levels at ${aqi.pm10} µg/m³ ${aqi.pm10 > 50 ? "may trigger allergies" : "are within acceptable range"}.`,
      },
    ],
  }
}
