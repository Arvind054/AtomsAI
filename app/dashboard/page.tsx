"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { MapPin, Calendar, Leaf, RefreshCw, Loader2, AlertTriangle, Navigation, MapPinOff, Settings } from "lucide-react"
import { Container } from "@/components/container"
import { WeatherCard } from "@/components/weather-card"
import { AQICard } from "@/components/aqi-card"
import { RiskScoreCard } from "@/components/risk-score-card"
import { SuggestionList } from "@/components/suggestion-list"
import { HealthRisks } from "@/components/health-risks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useEnvironmentalData } from "@/hooks/use-environmental-data"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "@/components/session-provider"
import { Skeleton } from "@/components/ui/skeleton"

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

interface ProfileData {
  name: string
  age: number | null
  location: string
  pastIllness: string[]
  habits: {
    smoking: boolean
    alcohol: string
    exercise_level: string
    outdoor_exposure: string
    mask_usage: string
  }
  alertsEnabled: boolean
}

export default function DashboardPage() {
  const { user, isLoading: sessionLoading } = useSession()
  const [userName, setUserName] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null)
  const [locationDetected, setLocationDetected] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false)

  const { location: geoLocation, isLoading: geoLoading, error: geoError, getLocation } = useGeolocation()

  // Load profile from localStorage first
  useEffect(() => {
    const savedProfile = localStorage.getItem("atmosai-profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setUserProfile(parsed)
        // Use saved location as fallback
        if (parsed.location) {
          setUserLocation(parsed.location)
        }
      } catch {
        console.error("Failed to parse profile")
      }
    }
    setProfileLoaded(true)
  }, [])

  // Detect location on mount (after profile is loaded)
  useEffect(() => {
    if (!locationDetected && !geoLoading && profileLoaded) {
      getLocation().then((loc) => {
        if (loc) {
          // Store coordinates for API calls
          setUserCoords({ latitude: loc.latitude, longitude: loc.longitude })
          // Use city, state, country format for display
          const parts = [loc.city, loc.state, loc.country].filter(Boolean)
          const displayLocation = parts.length > 0 ? parts.join(", ") : loc.formattedAddress || "Your Location"
          setUserLocation(displayLocation)
          setLocationPermissionDenied(false)
        } else {
          // Location denied or failed - check if we have saved location
          setLocationPermissionDenied(true)
        }
        setLocationDetected(true)
      })
    }
  }, [locationDetected, geoLoading, getLocation, profileLoaded])

  // Get user name from session (prioritize session over local storage)
  useEffect(() => {
    if (user?.name) {
      setUserName(user.name.split(' ')[0]) // Use first name only
    } else if (userProfile?.name) {
      setUserName(userProfile.name)
    }
  }, [user, userProfile])

  // Memoize the user profile for the hook to prevent infinite loops
  const memoizedProfile = useMemo(() => {
    if (!userProfile) return undefined
    return {
      age: userProfile.age ?? undefined,
      pastIllness: userProfile.pastIllness,
      habits: userProfile.habits,
    }
  }, [userProfile])

  // Only fetch data when we have location ready
  const isLocationReady = locationDetected && (userLocation || userCoords)
  const isUserReady = !sessionLoading

  const {
    weather,
    aqi,
    suggestions,
    riskScore,
    healthRisks,
    isLoadingWeather,
    isLoadingSuggestions,
    error,
    refresh,
  } = useEnvironmentalData(
    isLocationReady ? userLocation : null, 
    memoizedProfile, 
    isLocationReady ? userCoords : null
  )

  const handleRefresh = () => {
    refresh()
  }

  const handleRetryLocation = () => {
    setLocationDetected(false)
    setLocationPermissionDenied(false)
    getLocation().then((loc) => {
      if (loc) {
        setUserCoords({ latitude: loc.latitude, longitude: loc.longitude })
        const parts = [loc.city, loc.state, loc.country].filter(Boolean)
        const displayLocation = parts.length > 0 ? parts.join(", ") : loc.formattedAddress || "Your Location"
        setUserLocation(displayLocation)
        setLocationPermissionDenied(false)
      } else {
        setLocationPermissionDenied(true)
      }
      setLocationDetected(true)
    })
  }

  const isLoading = isLoadingWeather || isLoadingSuggestions
  const isInitializing = !locationDetected || !profileLoaded || sessionLoading
  const needsLocation = locationDetected && !userLocation && locationPermissionDenied

  // Show initializing state
  if (isInitializing) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen">
          <Container className="py-8">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg mb-6">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your dashboard</h2>
              <p className="text-gray-500 text-center max-w-md">
                {!profileLoaded ? "Loading your profile..." : 
                 sessionLoading ? "Checking authentication..." :
                 geoLoading ? "Detecting your location..." : "Almost ready..."}
              </p>
            </div>
          </Container>
        </div>
      </>
    )
  }

  // Show location permission required state
  if (needsLocation) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen">
          <Container className="py-8">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 mb-6">
                <MapPinOff className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Location Access Required</h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {geoError || "We need access to your location to provide personalized weather data and health recommendations."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleRetryLocation} className="gap-2">
                  <Navigation className="h-4 w-4" />
                  Allow Location Access
                </Button>
                <Link href="/profile">
                  <Button variant="outline" className="gap-2 w-full">
                    <Settings className="h-4 w-4" />
                    Set Location Manually
                  </Button>
                </Link>
              </div>
              {userProfile?.location && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-2">
                    <strong>Or use your saved location:</strong>
                  </p>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => {
                      setUserLocation(userProfile.location)
                      setLocationPermissionDenied(false)
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    {userProfile.location}
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </div>
      </>
    )
  }

  return (
    <>
    <Navbar />
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
                  {isLoading ? "Updating..." : "Live Data"}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {getGreeting()},{" "}
                {!userName ? (
                  <Skeleton className="inline-block h-8 w-32 align-middle" />
                ) : (
                  <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{userName}</span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate()}
                </span>
                <button 
                  onClick={handleRetryLocation}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  title="Click to refresh location"
                >
                  {geoLoading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4 text-primary" />
                  )}
                  {geoLoading ? "Detecting location..." : (userLocation || "Detect your location")}
                </button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading || !userLocation}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State for Weather */}
        {isLoadingWeather && !weather && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-500">Fetching weather data...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {weather && aqi && (
          <>
            {/* Main Cards Grid */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <WeatherCard 
                temperature={weather.temperature}
                humidity={weather.humidity}
                condition={weather.condition}
                windSpeed={weather.windSpeed}
              />
              <AQICard 
                value={aqi.value}
                trend={aqi.value > 100 ? "up" : "down"}
              />
              <RiskScoreCard 
                score={riskScore?.score || Math.min(Math.round(aqi.value * 0.5), 100)}
                reason={riskScore?.reason || `AQI ${aqi.value} - ${aqi.category}`}
              />
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-emerald-100">PM2.5</p>
                <p className="mt-1 text-3xl font-bold">{aqi.pm25} µg/m³</p>
                <p className="mt-2 text-xs text-emerald-200">
                  {aqi.pm25 > 35 ? "Above safe limit" : "Within safe range"}
                </p>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-teal-500 to-teal-600 p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-teal-100">PM10</p>
                <p className="mt-1 text-3xl font-bold">{aqi.pm10} µg/m³</p>
                <p className="mt-2 text-xs text-teal-200">
                  {aqi.pm10 > 50 ? "Moderate level" : "Good level"}
                </p>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-cyan-100">Ozone</p>
                <p className="mt-1 text-3xl font-bold">{aqi.ozone} µg/m³</p>
                <p className="mt-2 text-xs text-cyan-200">
                  {aqi.ozone > 100 ? "Elevated level" : "Within safe range"}
                </p>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-green-100">UV Index</p>
                <p className="mt-1 text-3xl font-bold">{weather.uvIndex}</p>
                <p className="mt-2 text-xs text-green-200">
                  {weather.uvIndex >= 8 ? "Very High - Use protection" : weather.uvIndex >= 6 ? "High - Use protection" : weather.uvIndex >= 3 ? "Moderate" : "Low"}
                </p>
              </div>
            </div>

            {/* Suggestions Section with Loading State */}
            {isLoadingSuggestions ? (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Generating AI Suggestions...</h3>
                </div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <SuggestionList suggestions={suggestions} />
            ) : null}

            {/* Health Risks Section with Loading State */}
            {isLoadingSuggestions ? (
              <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Analyzing Health Risks...</h3>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            ) : healthRisks.length > 0 ? (
              <div className="mt-8">
                <HealthRisks risks={healthRisks} />
              </div>
            ) : null}
          </>
        )}
      </Container>
    </div>
    </>
  )
}
