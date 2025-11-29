"use client"

import { Cloud, Droplets, Thermometer, Wind, Sun, CloudRain, CloudSnow, CloudFog } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WeatherCardProps {
  temperature: number
  humidity: number
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy"
  windSpeed?: number
}

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  foggy: CloudFog,
}

const conditionLabels = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
  foggy: "Foggy",
}

const conditionColors = {
  sunny: "bg-amber-100 text-amber-700",
  cloudy: "bg-gray-100 text-gray-700",
  rainy: "bg-blue-100 text-blue-700",
  snowy: "bg-slate-100 text-slate-700",
  foggy: "bg-gray-100 text-gray-600",
}

export function WeatherCard({ temperature, humidity, condition, windSpeed = 12 }: WeatherCardProps) {
  const ConditionIcon = conditionIcons[condition]

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700">Weather</CardTitle>
          <Badge className={conditionColors[condition]}>
            {conditionLabels[condition]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Temperature Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold text-gray-900">{temperature}</span>
            <span className="mb-2 text-2xl text-gray-400">°C</span>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <ConditionIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-white/80 p-3 shadow-sm">
            <Thermometer className="h-5 w-5 text-red-400 mb-1" />
            <span className="text-xs text-gray-500">Feels Like</span>
            <span className="text-sm font-semibold text-gray-700">{temperature + 2}°C</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/80 p-3 shadow-sm">
            <Droplets className="h-5 w-5 text-blue-400 mb-1" />
            <span className="text-xs text-gray-500">Humidity</span>
            <span className="text-sm font-semibold text-gray-700">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/80 p-3 shadow-sm">
            <Wind className="h-5 w-5 text-teal-400 mb-1" />
            <span className="text-xs text-gray-500">Wind</span>
            <span className="text-sm font-semibold text-gray-700">{windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
