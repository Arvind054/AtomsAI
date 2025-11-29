"use client"

import { 
  AlertCircle, 
  Ban, 
  Home, 
  Shirt, 
  Wind,
  Droplets,
  Activity,
  LucideIcon
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Suggestion {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  icon: "exercise" | "mask" | "windows" | "hydration" | "indoor" | "air"
}

interface SuggestionListProps {
  suggestions: Suggestion[]
}

const iconMap: Record<string, LucideIcon> = {
  exercise: Ban,
  mask: Shirt,
  windows: Home,
  hydration: Droplets,
  indoor: Home,
  air: Wind,
}

const priorityVariants = {
  low: "info" as const,
  medium: "warning" as const,
  high: "destructive" as const,
}

const priorityColors = {
  low: "border-l-4 border-l-primary",
  medium: "border-l-4 border-l-amber-400",
  high: "border-l-4 border-l-red-500",
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  return (
    <Card className="border-0 bg-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <Activity className="h-5 w-5 text-primary" />
          Health Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = iconMap[suggestion.icon] || AlertCircle
          return (
            <Alert
              key={suggestion.id}
              variant={priorityVariants[suggestion.priority]}
              className={`${priorityColors[suggestion.priority]} rounded-xl`}
            >
              <Icon className="h-5 w-5" />
              <AlertTitle className="font-semibold">{suggestion.title}</AlertTitle>
              <AlertDescription>{suggestion.description}</AlertDescription>
            </Alert>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Default mock suggestions
export const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Limit Outdoor Activity",
    description: "Avoid outdoor exercise in the afternoon when pollution levels peak.",
    priority: "high",
    icon: "exercise",
  },
  {
    id: "2",
    title: "Wear Protective Mask",
    description: "Use N95 mask if going outside to filter harmful particles.",
    priority: "medium",
    icon: "mask",
  },
  {
    id: "3",
    title: "Keep Windows Closed",
    description: "Keep windows closed during peak pollution hours (12 PM - 6 PM).",
    priority: "medium",
    icon: "windows",
  },
  {
    id: "4",
    title: "Stay Hydrated",
    description: "Drink plenty of water to help your body flush out toxins.",
    priority: "low",
    icon: "hydration",
  },
  {
    id: "5",
    title: "Use Air Purifier",
    description: "Consider using an indoor air purifier with HEPA filter.",
    priority: "low",
    icon: "air",
  },
]
