import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  totalIncome: number
  totalExpenses: number
  savings: number
}

export function DashboardStats({ totalIncome, totalExpenses, savings }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="glass-card hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          <div className="text-2xl">💰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          <div className="text-2xl">💸</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
          <div className="text-2xl">📈</div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${savings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {formatCurrency(savings)}
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  )
}
