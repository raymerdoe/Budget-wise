import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">BudgetWise</div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-primary/10 text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text animate-float">
              Track Your Money,
              <br />
              <span className="text-4xl md:text-6xl">Level Up Your Life</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              The Gen Z way to manage your finances. Beautiful, intuitive, and actually fun to use. Start building
              wealth today with BudgetWise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-primary/30 transition-all duration-300 text-lg px-8 py-6 animate-glow"
              >
                Start Tracking Free 💸
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 text-foreground text-lg px-8 py-6 bg-transparent"
              >
                See Features 📈
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">Why BudgetWise?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the digital generation with features that actually make sense
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl mb-4 group-hover:animate-bounce">📊</div>
                <h3 className="text-2xl font-bold text-primary">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Beautiful charts and insights that help you understand your spending patterns
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl mb-4 group-hover:animate-bounce">🎯</div>
                <h3 className="text-2xl font-bold text-primary">Goal Setting</h3>
                <p className="text-muted-foreground">
                  Set monthly budgets and track your progress with gamified achievements
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl mb-4 group-hover:animate-bounce">📱</div>
                <h3 className="text-2xl font-bold text-primary">Mobile First</h3>
                <p className="text-muted-foreground">Designed for your phone. Add transactions on the go with a tap</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 text-center space-y-8">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Gen Z users who are already taking control of their finances
            </p>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-primary/30 transition-all duration-300 text-lg px-12 py-6"
              >
                Create Your Account 🚀
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-32 border-t border-border/50">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold gradient-text">BudgetWise</div>
          <p className="text-muted-foreground">Designed & Developed by Raymer Surio</p>
          <p className="text-sm text-muted-foreground">© 2025 BudgetWise. Built with love for the next generation.</p>
        </div>
      </footer>
    </div>
  )
}
