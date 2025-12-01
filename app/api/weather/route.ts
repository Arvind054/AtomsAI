import { NextRequest, NextResponse } from "next/server"

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

// Map OpenWeatherMap condition codes to our conditions
function mapCondition(weatherId: number): "sunny" | "cloudy" | "rainy" | "snowy" | "foggy" {
  if (weatherId >= 200 && weatherId < 600) return "rainy"
  if (weatherId >= 600 && weatherId < 700) return "snowy"
  if (weatherId >= 700 && weatherId < 800) return "foggy"
  if (weatherId === 800) return "sunny"
  return "cloudy"
}

// Get AQI category based on value
function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  console.log("Weather API called with:", { location, lat, lon })

  if (!location && (!lat || !lon)) {
    return NextResponse.json(
      { error: "Location or coordinates are required" },
      { status: 400 }
    )
  }

  try {
    // Use Open-Meteo API (free, no API key required)
    let latitude: number
    let longitude: number

    if (lat && lon) {
      latitude = parseFloat(lat)
      longitude = parseFloat(lon)
    } else {
      // Extract city name from location string (take first part before comma)
      const searchQuery = location!.split(",")[0].trim()
      console.log("Geocoding search query:", searchQuery)
      
      // Geocode the location using Open-Meteo Geocoding API
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`
      console.log("Geocoding URL:", geoUrl)
      
      const geoResponse = await fetch(geoUrl)
      
      if (!geoResponse.ok) {
        console.error("Geocoding API error:", geoResponse.status, geoResponse.statusText)
        return NextResponse.json(
          { error: `Geocoding failed: ${geoResponse.statusText}` },
          { status: geoResponse.status }
        )
      }
      
      const geoData = await geoResponse.json()
      console.log("Geocoding response:", JSON.stringify(geoData))
      
      if (!geoData.results || geoData.results.length === 0) {
        // Try with full location string as fallback
        const fallbackUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location!)}&count=1&language=en&format=json`
        const fallbackResponse = await fetch(fallbackUrl)
        const fallbackData = await fallbackResponse.json()
        
        if (!fallbackData.results || fallbackData.results.length === 0) {
          return NextResponse.json(
            { error: `Location not found: ${location}` },
            { status: 404 }
          )
        }
        
        latitude = fallbackData.results[0].latitude
        longitude = fallbackData.results[0].longitude
      } else {
        latitude = geoData.results[0].latitude
        longitude = geoData.results[0].longitude
      }
    }

    console.log("Coordinates:", { latitude, longitude })

    // Fetch weather data from Open-Meteo
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,visibility,uv_index&timezone=auto`
    )
    const weatherData = await weatherResponse.json()

    // Fetch air quality data from Open-Meteo
    const aqiResponse = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
    )
    const aqiData = await aqiResponse.json()

    const current = weatherData.current
    const currentAqi = aqiData.current

    // Map weather code to condition
    const weatherCode = current.weather_code
    let condition: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy" = "sunny"
    let conditionDescription = "Clear sky"

    if (weatherCode === 0) {
      condition = "sunny"
      conditionDescription = "Clear sky"
    } else if (weatherCode <= 3) {
      condition = "cloudy"
      conditionDescription = weatherCode === 1 ? "Mainly clear" : weatherCode === 2 ? "Partly cloudy" : "Overcast"
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      condition = "foggy"
      conditionDescription = "Foggy"
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      condition = "rainy"
      conditionDescription = "Rainy"
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      condition = "snowy"
      conditionDescription = "Snowy"
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      condition = "rainy"
      conditionDescription = "Rain showers"
    } else if (weatherCode >= 85 && weatherCode <= 86) {
      condition = "snowy"
      conditionDescription = "Snow showers"
    } else if (weatherCode >= 95) {
      condition = "rainy"
      conditionDescription = "Thunderstorm"
    }

    const weather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      condition,
      conditionDescription,
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.surface_pressure),
      visibility: current.visibility ? Math.round(current.visibility / 1000) : 10, // Convert to km
      uvIndex: Math.round(current.uv_index || 0),
    }

    const aqi: AQIData = {
      value: currentAqi.us_aqi || 0,
      category: getAQICategory(currentAqi.us_aqi || 0),
      pm25: Math.round(currentAqi.pm2_5 || 0),
      pm10: Math.round(currentAqi.pm10 || 0),
      ozone: Math.round(currentAqi.ozone || 0),
      no2: Math.round(currentAqi.nitrogen_dioxide || 0),
      so2: Math.round(currentAqi.sulphur_dioxide || 0),
      co: Math.round((currentAqi.carbon_monoxide || 0) / 1000), // Convert to mg/m³
    }

    return NextResponse.json({
      weather,
      aqi,
      location: {
        latitude,
        longitude,
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
