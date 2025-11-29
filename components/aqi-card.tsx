"use client"

import { Activity, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AQICardProps {
  value: number
  trend?: "up" | "down" | "stable"
}

function getAQICategory(value: number) {
  if (value <= 50) return { label: "Good", color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50", ringColor: "stroke-emerald-500" }
  if (value <= 100) return { label: "Moderate", color: "bg-amber-400", textColor: "text-amber-600", bgColor: "bg-amber-50", ringColor: "stroke-amber-400" }
  if (value <= 150) return { label: "Unhealthy (Sensitive)", color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50", ringColor: "stroke-orange-500" }
  if (value <= 200) return { label: "Unhealthy", color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50", ringColor: "stroke-red-500" }
  if (value <= 300) return { label: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50", ringColor: "stroke-purple-500" }
  return { label: "Hazardous", color: "bg-rose-800", textColor: "text-rose-800", bgColor: "bg-rose-50", ringColor: "stroke-rose-800" }
}

export function AQICard({ value, trend = "stable" }: AQICardProps) {
  const category = getAQICategory(value)
  const percentage = Math.min((value / 500) * 100, 100)
  const circumference = 2 * Math.PI * 60 // radius of 60
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className={`overflow-hidden border-0 shadow-xl ${category.bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700">Air Quality Index</CardTitle>
          <Badge className={`${category.color} text-white`}>
            {category.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Circular Progress */}
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/50"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={category.ringColor}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-bold ${category.textColor}`}>{value}</span>
              <span className="text-xs text-gray-500">AQI</span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 shadow-sm">
              <Activity className={`h-4 w-4 ${category.textColor}`} />
              <span className="text-sm font-medium text-gray-700">PM2.5</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 shadow-sm">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-emerald-500" />
              ) : (
                <Activity className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
