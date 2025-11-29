import { Container } from "@/components/container"
import { ProfileForm } from "@/components/profile-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Container className="py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Profile Form */}
        <div className="mx-auto max-w-2xl">
          <ProfileForm />
        </div>
      </Container>
    </div>
  )
}
