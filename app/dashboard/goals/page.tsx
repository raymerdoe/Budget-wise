import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BudgetGoalsList } from "@/components/goals/budget-goals-list"
import { AddBudgetGoalDialog } from "@/components/goals/add-budget-goal-dialog"

export default async function GoalsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get current month budget goals
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const { data: budgetGoals } = await supabase
    .from("budget_goals")
    .select(`
      *,
      categories (
        name,
        icon,
        color
      )
    `)
    .eq("user_id", data.user.id)
    .eq("month", currentMonth)
    .eq("year", currentYear)

  // Get current month spending for each category
  const { data: currentSpending } = await supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", data.user.id)
    .eq("type", "expense")
    .gte("date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`)
    .lt("date", `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`)

  // Get categories for the add dialog
  const { data: categories } = await supabase.from("categories").select("*").eq("type", "expense").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Budget Goals 🎯
            </h1>
            <p className="text-muted-foreground">Set and track your monthly spending limits</p>
          </div>
          <AddBudgetGoalDialog categories={categories || []} />
        </div>

        <BudgetGoalsList budgetGoals={budgetGoals || []} currentSpending={currentSpending || []} />
      </main>
    </div>
  )
}
