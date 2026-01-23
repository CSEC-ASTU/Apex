import { Navigate } from "react-router-dom"
import { SignInForm } from "@/components/signin-form"
import { useSession } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function SignInPage() {
  const { data: session, isPending } = useSession()

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl space-y-4">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  // Redirect to dashboard if already signed in
  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  )
}
