import { Suspense } from "react"
import { AuthPage } from "@/components/auth-page"

function SignupContent() {
  return <AuthPage mode="signup" />
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
