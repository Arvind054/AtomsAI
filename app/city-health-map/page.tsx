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
        <Container className="py-8">
          <div className="w-full h-[calc(100vh-8rem)]">
            <iframe
              src="https://www.iqair.com/in-en/air-quality-map"
              className="w-full h-full border-0 rounded-lg"
              title="IQAir Quality Map"
              loading="lazy"
            />
          </div>
        </Container>
      </div>
    </>
  )
}
