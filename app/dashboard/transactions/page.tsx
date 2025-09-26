import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"

export default async function TransactionsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get all transactions
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

  // Get categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-muted-foreground">Track your income and expenses</p>
          </div>
          <AddTransactionDialog categories={categories || []} />
        </div>

        <TransactionsList transactions={transactions || []} />
      </main>
    </div>
  )
}
