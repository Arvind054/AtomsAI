"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

// Social login icons as SVG components
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

interface AuthPageProps {
  mode: "login" | "signup"
}

export function AuthPage({ mode }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSocialLogin = async (provider: "google" | "microsoft" | "apple") => {
    setIsLoading(provider)
    
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })
    } catch (error) {
      console.error("Authentication error:", error)
      toast.error("Authentication failed", {
        description: "Please try again or use a different provider.",
      })
      setIsLoading(null)
    }
  }

  const isLogin = mode === "login"
  const title = isLogin ? "Welcome back" : "Create your account"
  const description = isLogin
    ? "Sign in to access your personalized air quality dashboard"
    : "Get started with AtmosAI for free"
  const altText = isLogin ? "Don't have an account?" : "Already have an account?"
  const altLink = isLogin ? "/signup" : "/login"
  const altLinkText = isLogin ? "Sign up" : "Sign in"

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-white via-emerald-50/50 to-white">
      {/* Header */}
      <header className="w-full p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              AtmosAI
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg mb-2">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-gray-500">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium gap-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading !== null}
            >
              {isLoading === "google" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon className="h-5 w-5" />
              )}
              Continue with Google
            </Button>

            {/* Microsoft Login - Temporarily Disabled */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium gap-3 rounded-xl opacity-50 cursor-not-allowed"
              disabled
              title="Coming soon"
            >
              <MicrosoftIcon className="h-5 w-5" />
              Continue with Microsoft
              <span className="ml-auto text-xs text-gray-400">Soon</span>
            </Button>

            {/* Apple Login - Temporarily Disabled */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium gap-3 rounded-xl opacity-50 cursor-not-allowed"
              disabled
              title="Coming soon"
            >
              <AppleIcon className="h-5 w-5" />
              Continue with Apple
              <span className="ml-auto text-xs text-gray-400">Soon</span>
            </Button>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
                Secure authentication
              </span>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to AtmosAI&apos;s{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Switch between login/signup */}
            <div className="text-center pt-4">
              <span className="text-sm text-gray-500">{altText} </span>
              <Link href={altLink} className="text-sm font-semibold text-primary hover:underline">
                {altLinkText}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center text-sm text-gray-400">
        © 2025 AtmosAI. All rights reserved.
      </footer>
    </div>
  )
}
