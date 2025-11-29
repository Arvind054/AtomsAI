"use client"

import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RiskScoreCardProps {
  score: number
  reason: string
}

function getRiskLevel(score: number) {
  if (score <= 25) return { 
    label: "Low Risk", 
    color: "bg-emerald-500", 
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    icon: ShieldCheck,
    barColor: "bg-emerald-500"
  }
  if (score <= 50) return { 
    label: "Moderate Risk", 
    color: "bg-amber-400", 
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    icon: ShieldAlert,
    barColor: "bg-amber-400"
  }
  if (score <= 75) return { 
    label: "High Risk", 
    color: "bg-orange-500", 
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: AlertTriangle,
    barColor: "bg-orange-500"
  }
  return { 
    label: "Severe Risk", 
    color: "bg-red-500", 
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    icon: AlertOctagon,
    barColor: "bg-red-500"
  }
}

export function RiskScoreCard({ score, reason }: RiskScoreCardProps) {
  const riskLevel = getRiskLevel(score)
  const RiskIcon = riskLevel.icon

  return (
    <Card className={`overflow-hidden border-0 shadow-xl ${riskLevel.bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700">Health Risk Score</CardTitle>
          <Badge className={`${riskLevel.color} text-white`}>
            {riskLevel.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${riskLevel.color}`}>
            <RiskIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-1">
              <span className={`text-4xl font-bold ${riskLevel.textColor}`}>{score}</span>
              <span className="mb-1 text-lg text-gray-400">/100</span>
            </div>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Severe</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${riskLevel.barColor}`}
              style={{ width: `${score}%` }}
            />
            {/* Markers */}
            <div className="absolute inset-0 flex">
              <div className="w-1/4 border-r border-gray-200/50" />
              <div className="w-1/4 border-r border-gray-200/50" />
              <div className="w-1/4 border-r border-gray-200/50" />
              <div className="w-1/4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
