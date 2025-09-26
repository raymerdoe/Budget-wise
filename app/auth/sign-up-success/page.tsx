import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            BudgetWise
          </Link>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4 animate-bounce">📧</div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Check Your Email!
            </CardTitle>
            <CardDescription>We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              You've successfully signed up for BudgetWise! Please check your email and click the confirmation link to
              activate your account.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 bg-transparent">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
