"use client"

import Link from "next/link"
import { 
  Leaf, 
  Shield, 
  Activity, 
  Users, 
  Globe, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Wind,
  Heart,
  Bell,
  Smartphone,
  BarChart3,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { value: "50M+", label: "Air Quality Readings", icon: Activity },
  { value: "100+", label: "Cities Covered", icon: Globe },
  { value: "500K+", label: "Active Users", icon: Users },
  { value: "99.9%", label: "Uptime", icon: Zap },
]

const features = [
  {
    icon: Wind,
    title: "Real-Time AQI Monitoring",
    description: "Get instant updates on air quality index with detailed pollutant breakdowns including PM2.5, PM10, and ozone levels.",
  },
  {
    icon: Heart,
    title: "Personalized Health Insights",
    description: "Receive tailored health recommendations based on your sensitivity level and existing health conditions.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified when air quality changes in your area, helping you plan outdoor activities safely.",
  },
  {
    icon: Shield,
    title: "Health Risk Assessment",
    description: "Our AI analyzes multiple factors to provide accurate health risk scores personalized for you.",
  },
  {
    icon: MapPin,
    title: "Location-Based Data",
    description: "Automatic location detection provides hyper-local air quality data for your exact neighborhood.",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Access",
    description: "Access your dashboard from any device - desktop, tablet, or mobile with seamless sync.",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and tell us about your health conditions and sensitivity levels for personalized recommendations.",
  },
  {
    step: "02",
    title: "Set Your Location",
    description: "Allow location access or manually set your city to receive accurate local air quality data.",
  },
  {
    step: "03",
    title: "Get Insights",
    description: "View real-time AQI, weather data, health risk scores, and personalized recommendations on your dashboard.",
  },
  {
    step: "04",
    title: "Stay Protected",
    description: "Receive smart alerts and daily recommendations to protect your health from poor air quality.",
  },
]

const advantages = [
  "AI-powered health risk predictions",
  "Personalized recommendations for sensitive groups",
  "Historical data and trend analysis",
  "Integration with weather forecasts",
  "Privacy-focused with local data storage",
  "No subscription required for core features",
]

export default function StartPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-emerald-50/30 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/start" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                AtmosAI
              </span>
            </Link>
            <Link href="/">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              🌱 Breathe Better, Live Healthier
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Your Personal
              <span className="block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Air Quality Guardian
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              AtmosAI uses advanced AI to monitor air quality, predict health risks, 
              and provide personalized recommendations to keep you and your family safe.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/">
                <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 rounded-full">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-primary to-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to
              <span className="text-primary"> Breathe Easy</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive tools and insights to help you understand and protect yourself from air pollution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow group">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 group-hover:from-primary group-hover:to-secondary transition-colors">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Get Started in <span className="text-primary">4 Simple Steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why AtmosAI</Badge>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                The <span className="text-primary">Smartest Way</span> to Monitor Air Quality
              </h2>
              <p className="text-gray-600 mb-8">
                AtmosAI combines cutting-edge artificial intelligence with comprehensive environmental data 
                to provide you with the most accurate and personalized air quality insights available.
              </p>
              <ul className="space-y-4">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-linear-to-br from-primary to-secondary p-8 text-white shadow-2xl">
                <div className="mb-6">
                  <div className="text-sm text-emerald-200 mb-1">Current AQI</div>
                  <div className="text-5xl font-bold">142</div>
                  <div className="text-emerald-200">Unhealthy for Sensitive Groups</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-xl bg-white/20 p-3 text-center">
                    <div className="text-2xl font-bold">28°</div>
                    <div className="text-xs text-emerald-200">Temp</div>
                  </div>
                  <div className="rounded-xl bg-white/20 p-3 text-center">
                    <div className="text-2xl font-bold">65%</div>
                    <div className="text-xs text-emerald-200">Humidity</div>
                  </div>
                  <div className="rounded-xl bg-white/20 p-3 text-center">
                    <div className="text-2xl font-bold">58</div>
                    <div className="text-xs text-emerald-200">Risk Score</div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4" />
                    <span>Recommendation: Limit outdoor activity today</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-4 -right-4 h-full w-full rounded-3xl bg-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-gray-900 to-gray-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Start Protecting Your Health Today
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join hundreds of thousands of users who trust AtmosAI to keep them informed and safe.
            Free to use, no credit card required.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-full shadow-lg shadow-primary/30">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 rounded-full border-gray-600 text-gray-300 hover:bg-gray-800">
                Create Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AtmosAI</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <Link href="/start" className="hover:text-white transition-colors">Home</Link>
              <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 AtmosAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
