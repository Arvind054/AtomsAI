"use client"

import Link from "next/link"
import { Bot, ArrowLeft, MessageSquare, Brain, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Container } from "@/components/container"

export default function HealthAssistantPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-white">
        <Container className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-secondary shadow-2xl">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
                Soon
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Personalized Health Assistant
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mb-8">
              AI-powered health companion that provides personalized advice based on your health profile and environmental conditions
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 mb-3">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Chat Interface</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Natural conversation with your health AI
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-3">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Smart Analysis</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Understands your health conditions
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mb-3">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Daily Alerts</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Proactive health notifications
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 mb-3">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Personalized Tips</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Tailored recommendations just for you
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Preview */}
              <div className="rounded-2xl bg-white border shadow-lg p-6 mb-8 max-w-lg mx-auto">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-3">
                      <p className="text-sm text-gray-700">
                        Hi! I&apos;m your health assistant. How can I help you today?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="rounded-2xl rounded-tr-none bg-primary px-4 py-3">
                      <p className="text-sm text-white">
                        Is it safe to go for a run today?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-3">
                      <p className="text-sm text-gray-700">
                        Based on current AQI (72) and your asthma condition, I&apos;d recommend indoor exercise today...
                      </p>
                    </div>
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
