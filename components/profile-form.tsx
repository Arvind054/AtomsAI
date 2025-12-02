"use client"

import { useState, useEffect } from "react"
import { Save, User, MapPin, HeartPulse, Loader2, CheckCircle, LocateFixed, Activity, Bell, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useSession } from "@/components/session-provider"

// Health conditions that can be stored in pastIllness array
const healthConditionOptions = [
  { id: "asthma", label: "Asthma", description: "Respiratory condition" },
  { id: "allergies", label: "Allergies", description: "Pollen, dust, etc." },
  { id: "copd", label: "COPD", description: "Chronic lung disease" },
  { id: "heart_disease", label: "Heart Disease", description: "Cardiovascular issues" },
  { id: "diabetes", label: "Diabetes", description: "Blood sugar condition" },
  { id: "hypertension", label: "Hypertension", description: "High blood pressure" },
]

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

const defaultProfile: ProfileData = {
  name: "",
  age: null,
  location: "",
  pastIllness: [],
  habits: {
    smoking: false,
    alcohol: "none",
    exercise_level: "medium",
    outdoor_exposure: "moderate",
    mask_usage: "sometimes",
  },
  alertsEnabled: true,
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { location, isLoading: isLoadingLocation, error: locationError, getLocation } = useGeolocation()
  const { user, isAuthenticated } = useSession()

  // Load profile from API if authenticated, otherwise from localStorage
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json();

            setProfile({
              name: data.name || defaultProfile.name,
              age: data.age || defaultProfile.age,
              location: data.location || defaultProfile.location,
              pastIllness: data.pastIllness || defaultProfile.pastIllness,
              habits: {
                smoking: data.habits?.smoking ?? defaultProfile.habits.smoking,
                alcohol: data.habits?.alcohol || defaultProfile.habits.alcohol,
                exercise_level: data.habits?.exercise_level || defaultProfile.habits.exercise_level,
                outdoor_exposure: data.habits?.outdoor_exposure || defaultProfile.habits.outdoor_exposure,
                mask_usage: data.habits?.mask_usage || defaultProfile.habits.mask_usage,
              },
              alertsEnabled: data.alertsEnabled ?? defaultProfile.alertsEnabled,
            })
          }
        } catch (error) {
          console.error("Failed to load profile from API:", error)
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedProfile = localStorage.getItem("atmosai-profile")
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile)
            // Merge with defaults to ensure all fields exist
            setProfile({
              name: parsed.name || defaultProfile.name,
              age: parsed.age ?? defaultProfile.age,
              location: parsed.location || parsed.city || defaultProfile.location, // Support old 'city' field
              pastIllness: Array.isArray(parsed.pastIllness) ? parsed.pastIllness : defaultProfile.pastIllness,
              habits: {
                smoking: parsed.habits?.smoking ?? defaultProfile.habits.smoking,
                alcohol: parsed.habits?.alcohol || defaultProfile.habits.alcohol,
                exercise_level: parsed.habits?.exercise_level || defaultProfile.habits.exercise_level,
                outdoor_exposure: parsed.habits?.outdoor_exposure || defaultProfile.habits.outdoor_exposure,
                mask_usage: parsed.habits?.mask_usage || defaultProfile.habits.mask_usage,
              },
              alertsEnabled: parsed.alertsEnabled ?? defaultProfile.alertsEnabled,
            })
          } catch {
            console.error("Failed to parse saved profile")
          }
        }
      }
      setIsLoadingProfile(false)
    }

    loadProfile()
  }, [isAuthenticated])

  // Handle location detection
  const handleDetectLocation = async () => {
    const locationData = await getLocation()
    
    if (locationData) {
      const cityName = locationData.city 
        ? `${locationData.city}${locationData.state ? `, ${locationData.state}` : ""}${locationData.country ? `, ${locationData.country}` : ""}`
        : locationData.formattedAddress || ""
      
      setProfile((prev) => ({ ...prev, location: cityName }))
      
      toast.success("Location detected!", {
        description: cityName || "Location coordinates saved",
      })
    } else if (locationError) {
      toast.error("Location detection failed", {
        description: locationError,
      })
    }
  }

  // Toggle health condition in pastIllness array
  const handleHealthConditionChange = (conditionId: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      pastIllness: checked
        ? [...(prev.pastIllness || []), conditionId]
        : (prev.pastIllness || []).filter((c) => c !== conditionId),
    }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!profile.name?.trim()) {
      toast.error("Name is required", {
        description: "Please enter your name to continue.",
      })
      return
    }

    if (!profile.location?.trim()) {
      toast.error("Location is required", {
        description: "Please enter your location for accurate air quality data.",
      })
      return
    }

    setIsSaving(true)

    try {
      // Save to localStorage for quick access
      localStorage.setItem("atmosai-profile", JSON.stringify(profile))

      // If authenticated, also save to database
      if (isAuthenticated) {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            age: profile.age,
            location: profile.location,
            pastIllness: profile.pastIllness,
            habits: profile.habits,
            alertsEnabled: profile.alertsEnabled,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save to database")
        }
      }

      setSaved(true)
      
      toast.success("Profile saved successfully!", {
        description: isAuthenticated 
          ? "Your profile has been saved to your account." 
          : "Your personalized recommendations are now active.",
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
      })
      
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast.error("Failed to save profile", {
        description: "Please try again later.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-0 bg-white shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Your Profile</CardTitle>
            <CardDescription>
              Manage your personal information and health settings
              {isAuthenticated && <span className="text-primary"> • Synced to your account</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {isLoadingProfile ? (
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      ) : (
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <User className="h-4 w-4" />
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age
              </label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : null }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Location
              </label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter your city"
                  value={profile.location}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDetectLocation}
                  disabled={isLoadingLocation}
                  title="Detect my location"
                  className="shrink-0"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Click the location button to auto-detect your city
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Health Conditions */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <HeartPulse className="h-4 w-4" />
            Health Conditions
          </h3>
          <p className="text-sm text-gray-500">
            Select any conditions that apply to receive personalized recommendations.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {healthConditionOptions.map((condition) => (
              <label 
                key={condition.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors"
              >
                <Checkbox
                  checked={profile.pastIllness?.includes(condition.id) ?? false}
                  onCheckedChange={(checked) => handleHealthConditionChange(condition.id, checked as boolean)}
                />
                <div>
                  <span className="font-medium text-gray-700">{condition.label}</span>
                  <p className="text-xs text-gray-500">{condition.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Lifestyle & Habits */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <Activity className="h-4 w-4" />
            Lifestyle & Habits
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Smoking */}
            <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
              <Checkbox
                checked={profile.habits.smoking}
                onCheckedChange={(checked) => setProfile((prev) => ({
                  ...prev,
                  habits: { ...prev.habits, smoking: checked as boolean }
                }))}
              />
              <div>
                <span className="font-medium text-gray-700">Smoker</span>
                <p className="text-xs text-gray-500">Current or former smoker</p>
              </div>
            </label>

            {/* Alcohol */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Alcohol Consumption</label>
              <Select
                value={profile.habits.alcohol}
                onValueChange={(value: "none" | "occasional" | "regular") => 
                  setProfile((prev) => ({ ...prev, habits: { ...prev.habits, alcohol: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exercise Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Exercise Level</label>
              <Select
                value={profile.habits.exercise_level}
                onValueChange={(value: "low" | "medium" | "high") => 
                  setProfile((prev) => ({ ...prev, habits: { ...prev.habits, exercise_level: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minimal activity</SelectItem>
                  <SelectItem value="medium">Medium - Moderate activity</SelectItem>
                  <SelectItem value="high">High - Very active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Outdoor Exposure */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Outdoor Exposure</label>
              <Select
                value={profile.habits.outdoor_exposure}
                onValueChange={(value: "low" | "moderate" | "high") => 
                  setProfile((prev) => ({ ...prev, habits: { ...prev.habits, outdoor_exposure: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Mostly indoors</SelectItem>
                  <SelectItem value="moderate">Moderate - Balanced</SelectItem>
                  <SelectItem value="high">High - Mostly outdoors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mask Usage */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mask Usage (Outdoors)</label>
              <Select
                value={profile.habits.mask_usage}
                onValueChange={(value: "never" | "sometimes" | "always") => 
                  setProfile((prev) => ({ ...prev, habits: { ...prev.habits, mask_usage: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="sometimes">Sometimes</SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Alert Preferences */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <Bell className="h-4 w-4" />
            Alert Preferences
          </h3>
          <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
            <Checkbox
              checked={profile.alertsEnabled}
              onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, alertsEnabled: checked as boolean }))}
            />
            <div>
              <span className="font-medium text-gray-700">Enable Air Quality Alerts</span>
              <p className="text-xs text-gray-500">Get notified when air quality changes in your area</p>
            </div>
          </label>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="text-sm font-medium text-emerald-600">
              ✓ Profile saved successfully!
            </span>
          )}
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
      )}
    </Card>
  )
}
