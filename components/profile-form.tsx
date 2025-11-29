"use client"

import { useState, useEffect } from "react"
import { Save, User, MapPin, HeartPulse, Loader2 } from "lucide-react"
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

interface ProfileData {
  name: string
  city: string
  sensitivityLevel: string
  healthConditions: {
    asthma: boolean
    allergies: boolean
    smoker: boolean
    heartLungSensitivity: boolean
  }
}

const defaultProfile: ProfileData = {
  name: "Arvind",
  city: "New Delhi",
  sensitivityLevel: "moderate",
  healthConditions: {
    asthma: false,
    allergies: false,
    smoker: false,
    heartLungSensitivity: false,
  },
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("atmosai-profile")
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch {
        console.error("Failed to parse saved profile")
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    localStorage.setItem("atmosai-profile", JSON.stringify(profile))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleHealthConditionChange = (condition: keyof ProfileData["healthConditions"], checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        [condition]: checked,
      },
    }))
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
            <CardDescription>Manage your personal information and health settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <User className="h-4 w-4" />
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
              <label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                City
              </label>
              <Input
                id="city"
                placeholder="Enter your city"
                value={profile.city}
                onChange={(e) => setProfile((prev) => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sensitivity Level */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <HeartPulse className="h-4 w-4" />
            Sensitivity Level
          </h3>
          <Select
            value={profile.sensitivityLevel}
            onValueChange={(value) => setProfile((prev) => ({ ...prev, sensitivityLevel: value }))}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select sensitivity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Generally healthy</SelectItem>
              <SelectItem value="moderate">Moderate - Some sensitivity</SelectItem>
              <SelectItem value="high">High - Very sensitive</SelectItem>
              <SelectItem value="critical">Critical - Requires special care</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            This helps us customize air quality recommendations for your needs.
          </p>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
              <Checkbox
                checked={profile.healthConditions.asthma}
                onCheckedChange={(checked) => handleHealthConditionChange("asthma", checked as boolean)}
              />
              <div>
                <span className="font-medium text-gray-700">Asthma</span>
                <p className="text-xs text-gray-500">Respiratory condition</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
              <Checkbox
                checked={profile.healthConditions.allergies}
                onCheckedChange={(checked) => handleHealthConditionChange("allergies", checked as boolean)}
              />
              <div>
                <span className="font-medium text-gray-700">Allergies</span>
                <p className="text-xs text-gray-500">Pollen, dust, etc.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
              <Checkbox
                checked={profile.healthConditions.smoker}
                onCheckedChange={(checked) => handleHealthConditionChange("smoker", checked as boolean)}
              />
              <div>
                <span className="font-medium text-gray-700">Smoker</span>
                <p className="text-xs text-gray-500">Current or former</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-colors">
              <Checkbox
                checked={profile.healthConditions.heartLungSensitivity}
                onCheckedChange={(checked) => handleHealthConditionChange("heartLungSensitivity", checked as boolean)}
              />
              <div>
                <span className="font-medium text-gray-700">Heart/Lung Sensitivity</span>
                <p className="text-xs text-gray-500">Cardiovascular issues</p>
              </div>
            </label>
          </div>
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
    </Card>
  )
}
