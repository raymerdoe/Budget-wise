import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpensePieChart } from "@/components/analytics/expense-pie-chart"
import { MonthlyTrendChart } from "@/components/analytics/monthly-trend-chart"
import { CategoryBreakdown } from "@/components/analytics/category-breakdown"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get current month transactions for pie chart
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const { data: currentMonthTransactions } = await supabase
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
    .eq("type", "expense")
    .gte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`)
    .lt("date", `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`)

  // Get last 6 months data for trend chart
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: monthlyData } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", data.user.id)
    .gte("date", sixMonthsAgo.toISOString().split("T")[0])
    .order("date", { ascending: true })

  // Get all transactions for category breakdown
  const { data: allTransactions } = await supabase
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Analytics 📊
            </h1>
            <p className="text-muted-foreground">Insights into your spending patterns</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <ExpensePieChart transactions={currentMonthTransactions || []} />
          <MonthlyTrendChart transactions={monthlyData || []} />
        </div>

        <CategoryBreakdown transactions={allTransactions || []} />
      </main>
    </div>
  )
}
