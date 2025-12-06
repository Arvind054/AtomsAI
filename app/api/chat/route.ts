import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/src/DB/db"
import { user as userTable } from "@/src/DB/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    // Require authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      )
    }
    const geminiApiKey =
      process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      console.error("Gemini API key not configured")
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 },
      )
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)

    // Load canonical user profile from DB (including location)
    const userId = session.user.id as string
    const [dbUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1)

    const profile = dbUser
      ? {
          name: dbUser.name,
          age: dbUser.age ?? undefined,
          location: dbUser.location ?? undefined,
          pastIllness: dbUser.pastIllness ?? [],
          habits: (dbUser.habits ?? {
            smoking: false,
            alcohol: "none",
            exercise_level: "medium",
            outdoor_exposure: "moderate",
            mask_usage: "sometimes",
          }) as {
            smoking?: boolean
            alcohol?: string
            exercise_level?: string
            outdoor_exposure?: string
            mask_usage?: string
          },
        }
      : null

    const location =
      profile?.location && typeof profile.location === "string"
        ? profile.location
        : null

    // Fetch fresh environmental data on the server using DB location
    let environmentalContextText = "No environmental data available"
    if (location) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const weatherRes = await fetch(
          `${baseUrl}/api/weather?location=${encodeURIComponent(location)}`,
          { cache: "no-store" },
        )

        if (weatherRes.ok) {
          const weatherJson = await weatherRes.json()
          const weather = weatherJson.weather
          const aqi = weatherJson.aqi

          environmentalContextText = `
- Location: ${location}
- AQI: ${aqi?.value ?? "Not available"}
- AQI category: ${aqi?.category ?? "Not available"}
- Temperature: ${weather?.temperature ?? "Not available"} °C
- Condition: ${weather?.conditionDescription ?? "Not available"}
- Humidity: ${weather?.humidity ?? "Not available"}%
`
        } else {
          console.error("Weather API error in chat route:", await weatherRes.text())
        }
      } catch (err) {
        console.error("Failed to fetch weather in chat route:", err)
      }
    }

    const systemPrompt = `You are AtmosAI's Personalized Health Assistant.
You provide concise, practical advice based on:
- User health profile (age, past illnesses, habits)
- Current air quality and weather
- User's location and lifestyle

USER HEALTH PROFILE:
${
  profile
    ? `
- Name: ${profile.name ?? "Not specified"}
- Age: ${profile.age ?? "Not specified"}
- Location: ${profile.location ?? "Not specified"}
- Past illnesses: ${
        profile.pastIllness && profile.pastIllness.length
          ? profile.pastIllness.join(", ")
          : "None reported"
      }
- Habits:
  - Smoking: ${profile.habits?.smoking ? "Yes" : "No"}
  - Exercise level: ${profile.habits?.exercise_level ?? "Not specified"}
  - Outdoor exposure: ${
        profile.habits?.outdoor_exposure ?? "Not specified"
      }
  - Mask usage: ${profile.habits?.mask_usage ?? "Not specified"}
`
    : "No profile data available"
}

ENVIRONMENTAL CONTEXT:
${environmentalContextText}

IMPORTANT:
- If location is "Not specified" or environmental context is missing, politely ask the user to set their location in the app so you can give more accurate advice.
GUIDELINES:
- Be empathetic and clear.
- 2–3 short paragraphs maximum.
- Focus on actionable advice (what to do now / today).
- If something could be serious, clearly say they should consult a doctor.
- Do NOT mention that you are an AI language model.
`
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      })

    const result = await model.generateContent(
      `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
    )
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    )
  }
}
