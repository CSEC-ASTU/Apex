import { useNavigate } from "react-router-dom"
import { SignUpForm } from "@/components/signup-form"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

export default function SignUpPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()

  // Redirect if already signed in
  if (session) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-center space-y-4">
          <p className="text-muted-foreground">You're already signed in.</p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignUpForm />
      </div>
    </div>
  )
}
