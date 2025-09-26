"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Transaction {
  amount: number
  categories: {
    name: string
    icon: string
    color: string
  }
}

interface ExpensePieChartProps {
  transactions: Transaction[]
}

export function ExpensePieChart({ transactions }: ExpensePieChartProps) {
  // Group transactions by category
  const categoryData = transactions.reduce(
    (acc, transaction) => {
      const categoryName = transaction.categories.name
      const existing = acc.find((item) => item.name === categoryName)

      if (existing) {
        existing.value += Number(transaction.amount)
      } else {
        acc.push({
          name: categoryName,
          value: Number(transaction.amount),
          color: transaction.categories.color,
          icon: transaction.categories.icon,
        })
      }

      return acc
    },
    [] as Array<{ name: string; value: number; color: string; icon: string }>,
  )

  // Sort by value and take top 6
  const sortedData = categoryData.sort((a, b) => b.value - a.value).slice(0, 6)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card p-3 border border-border/50">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{data.icon}</span>
            <span className="font-medium">{data.name}</span>
          </div>
          <p className="text-sm text-primary font-bold">{formatCurrency(data.value)}</p>
        </div>
      )
    }
    return null
  }

  if (sortedData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-muted-foreground">No expense data for this month</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Expense Categories
        </CardTitle>
        <p className="text-sm text-muted-foreground">This month's spending breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {sortedData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
