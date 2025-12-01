"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProfileData {
  name: string
  age: number | null
  location: string
  pastIllness: string[]
  habits: {
    smoking: boolean
    alcohol: "none" | "occasional" | "regular"
    exercise_level: "low" | "medium" | "high"
    outdoor_exposure: "low" | "moderate" | "high"
    mask_usage: "never" | "sometimes" | "always"
  }
  alertsEnabled: boolean
}

export function useProfileCheck() {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkProfileCompletion()
  }, [])

  const checkProfileCompletion = () => {
    const savedProfile = localStorage.getItem("atmosai-profile")
    
    if (!savedProfile) {
      setIsProfileComplete(false)
      showProfileToast()
      return
    }

    try {
      const parsedProfile: ProfileData = JSON.parse(savedProfile)
      setProfile(parsedProfile)

      // Check if essential fields are filled
      const isComplete = Boolean(
        parsedProfile.name?.trim() &&
        parsedProfile.location?.trim()
      )

      setIsProfileComplete(isComplete)

      if (!isComplete) {
        showProfileToast()
      }
    } catch {
      setIsProfileComplete(false)
      showProfileToast()
    }
  }

  const showProfileToast = () => {
    toast.warning("Complete your profile", {
      description: "Set up your health profile to get personalized air quality recommendations.",
      duration: 8000,
      action: {
        label: "Complete Profile",
        onClick: () => router.push("/profile"),
      },
    })
  }

  return { isProfileComplete, profile, checkProfileCompletion }
}
