"use client"

import { useState, useCallback } from "react"

interface LocationData {
  latitude: number
  longitude: number
  city: string | null
  state: string | null
  country: string | null
  formattedAddress: string | null
}

interface UseGeolocationReturn {
  location: LocationData | null
  isLoading: boolean
  error: string | null
  getLocation: () => Promise<LocationData | null>
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reverseGeocode = async (latitude: number, longitude: number): Promise<Partial<LocationData>> => {
    try {
      // Using OpenStreetMap's Nominatim for free reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AtmosAI/1.0",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch location data")
      }

      const data = await response.json()
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || null,
        state: data.address?.state || data.address?.region || null,
        country: data.address?.country || null,
        formattedAddress: data.display_name || null,
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err)
      return {
        city: null,
        state: null,
        country: null,
        formattedAddress: null,
      }
    }
  }

  const getLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return null
    }

    setIsLoading(true)
    setError(null)

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Get city name from coordinates
          const geoData = await reverseGeocode(latitude, longitude)
          
          const locationData: LocationData = {
            latitude,
            longitude,
            city: geoData.city || null,
            state: geoData.state || null,
            country: geoData.country || null,
            formattedAddress: geoData.formattedAddress || null,
          }

          setLocation(locationData)
          setIsLoading(false)
          resolve(locationData)
        },
        (err) => {
          let errorMessage = "Unable to retrieve your location"
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access in your browser settings."
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case err.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }
          
          setError(errorMessage)
          setIsLoading(false)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      )
    })
  }, [])

  return {
    location,
    isLoading,
    error,
    getLocation,
  }
}
