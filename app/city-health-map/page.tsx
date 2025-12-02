"use client"

import Link from "next/link"
import { Map, ArrowLeft, MapPin, Activity, Wind, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Container } from "@/components/container"

export default function CityHealthMapPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-white">
        <Container className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-secondary shadow-2xl">
                <Map className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
                Soon
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              City Health Map
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mb-8">
              Interactive map showing real-time air quality, health risks, and environmental conditions across your city
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-6 py-3 mb-12">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-700 font-semibold">Coming Soon</span>
            </div>

            {/* Feature Preview */}
            <div className="w-full max-w-4xl">
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-6">What to expect</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-3">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Live AQI Zones</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Color-coded zones showing air quality levels in real-time
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 mb-3">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Health Hotspots</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Identify areas with elevated health risks
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mb-3">
                      <Wind className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Wind Patterns</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Track pollution movement with wind direction data
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
