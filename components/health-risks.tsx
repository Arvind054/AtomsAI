"use client"

import { 
  AlertTriangle, 
  Stethoscope, 
  HeartPulse, 
  Brain,
  Wind,
  Eye,
  Baby,
  PersonStanding
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HealthRisk {
  id: string
  name: string
  severity: "low" | "moderate" | "high" | "severe"
  description: string
  affectedGroups: string[]
  icon: "respiratory" | "cardiovascular" | "neurological" | "eye" | "children" | "elderly"
}

interface HealthRisksProps {
  risks: HealthRisk[]
}

const iconMap = {
  respiratory: Wind,
  cardiovascular: HeartPulse,
  neurological: Brain,
  eye: Eye,
  children: Baby,
  elderly: PersonStanding,
}

const severityConfig = {
  low: { 
    color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
    badge: "bg-emerald-500",
    label: "Low Risk"
  },
  moderate: { 
    color: "bg-amber-100 text-amber-700 border-amber-200", 
    badge: "bg-amber-500",
    label: "Moderate"
  },
  high: { 
    color: "bg-orange-100 text-orange-700 border-orange-200", 
    badge: "bg-orange-500",
    label: "High Risk"
  },
  severe: { 
    color: "bg-red-100 text-red-700 border-red-200", 
    badge: "bg-red-500",
    label: "Severe"
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
          Based on current air quality conditions, the following health risks may arise
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((risk) => {
          const Icon = iconMap[risk.icon]
          const config = severityConfig[risk.severity]
          
          return (
            <div
              key={risk.id}
              className={`rounded-xl border p-4 ${config.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold">{risk.name}</h4>
                    <Badge className={`${config.badge} text-white text-xs`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{risk.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {risk.affectedGroups.map((group, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Prevention Tips */}
        <div className="mt-6 rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 border border-primary/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-gray-800">Prevention Tips</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Limit outdoor exposure during peak pollution hours (12 PM - 6 PM)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Use N95 masks when going outside for extended periods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Keep medications handy if you have pre-existing conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Stay hydrated and avoid strenuous outdoor activities</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data for health risks based on current AQI
export const mockHealthRisks: HealthRisk[] = [
  {
    id: "1",
    name: "Respiratory Irritation",
    severity: "high",
    description: "High PM2.5 levels can cause throat irritation, coughing, and shortness of breath. May trigger asthma attacks in sensitive individuals.",
    affectedGroups: ["Asthma patients", "COPD patients", "Smokers"],
    icon: "respiratory",
  },
  {
    id: "2",
    name: "Cardiovascular Stress",
    severity: "moderate",
    description: "Elevated pollution can increase heart rate and blood pressure, potentially leading to irregular heartbeat in vulnerable individuals.",
    affectedGroups: ["Heart patients", "Elderly", "High BP patients"],
    icon: "cardiovascular",
  },
  {
    id: "3",
    name: "Eye & Skin Irritation",
    severity: "moderate",
    description: "Pollutants and particulate matter can cause red, watery eyes and skin irritation, especially during prolonged outdoor exposure.",
    affectedGroups: ["Allergy sufferers", "Contact lens users", "Outdoor workers"],
    icon: "eye",
  },
  {
    id: "4",
    name: "Fatigue & Headaches",
    severity: "low",
    description: "Poor air quality can reduce oxygen efficiency, leading to tiredness, headaches, and difficulty concentrating.",
    affectedGroups: ["General population", "Office workers", "Students"],
    icon: "neurological",
  },
  {
    id: "5",
    name: "Child Development Concerns",
    severity: "high",
    description: "Children's developing lungs are more susceptible to pollution damage. Extended exposure may affect long-term respiratory health.",
    affectedGroups: ["Infants", "Children under 12", "Pregnant women"],
    icon: "children",
  },
]
