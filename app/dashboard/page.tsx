import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      categories (
        name,
        icon,
        color
      )
    `)
    .eq("user_id", data.user.id)
    .order("date", { ascending: false })
    .limit(5)

  // Get monthly stats
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const { data: monthlyStats } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", data.user.id)
    .gte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`)
    .lt("date", `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`)

  const totalIncome =
    monthlyStats?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalExpenses =
    monthlyStats?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const savings = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {profile?.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground">Here's your financial overview for this month</p>
        </div>

        <DashboardStats totalIncome={totalIncome} totalExpenses={totalExpenses} savings={savings} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions || []} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
