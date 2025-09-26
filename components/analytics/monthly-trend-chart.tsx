"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface Transaction {
  amount: number
  type: "income" | "expense"
  date: string
}

interface MonthlyTrendChartProps {
  transactions: Transaction[]
}

export function MonthlyTrendChart({ transactions }: MonthlyTrendChartProps) {
  // Group transactions by month
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
          savings: 0,
        }
      }

      if (transaction.type === "income") {
        acc[monthKey].income += Number(transaction.amount)
      } else {
        acc[monthKey].expenses += Number(transaction.amount)
      }

      acc[monthKey].savings = acc[monthKey].income - acc[monthKey].expenses

      return acc
    },
    {} as Record<string, { month: string; income: number; expenses: number; savings: number }>,
  )

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const aDate = new Date(a.month)
    const bDate = new Date(b.month)
    return aDate.getTime() - bDate.getTime()
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-border/50">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm capitalize">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-bold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-muted-foreground">No data available for trends</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Monthly Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">Income vs Expenses over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fill="url(#incomeGradient)" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expenseGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
