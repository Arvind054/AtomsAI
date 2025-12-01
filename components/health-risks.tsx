"use client"

import { 
  AlertTriangle, 
  Stethoscope, 
  HeartPulse, 
  Brain,
  Wind,
  Eye,
  Baby,
  PersonStanding,
  Shield
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HealthRisk {
  id: string
  condition: string
  risk: "low" | "medium" | "high"
  description: string
}

interface HealthRisksProps {
  risks: HealthRisk[]
}

const severityConfig = {
  low: { 
    color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
    badge: "bg-emerald-500",
    label: "Low Risk"
  },
  medium: { 
    color: "bg-amber-100 text-amber-700 border-amber-200", 
    badge: "bg-amber-500",
    label: "Moderate"
  },
  high: { 
    color: "bg-red-100 text-red-700 border-red-200", 
    badge: "bg-red-500",
    label: "High Risk"
  },
}

export function HealthRisks({ risks }: HealthRisksProps) {
  return (
    <Card className="border-0 bg-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Potential Health Risks
        </CardTitle>
        <p className="text-sm text-gray-500">
          Based on current air quality conditions and your health profile
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((risk) => {
          const config = severityConfig[risk.risk] || severityConfig.low
          
          return (
            <div
              key={risk.id}
              className={`rounded-xl border p-4 ${config.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold">{risk.condition}</h4>
                    <Badge className={`${config.badge} text-white text-xs`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{risk.description}</p>
                </div>
              </div>
            </div>
          )
        })}
        
        {risks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No significant health risks detected</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
