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
