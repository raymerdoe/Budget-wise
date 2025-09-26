"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Transaction {
  amount: number
  type: "income" | "expense"
  categories: {
    name: string
    icon: string
    color: string
  }
}

interface CategoryBreakdownProps {
  transactions: Transaction[]
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  // Group by category and type
  const categoryData = transactions.reduce(
    (acc, transaction) => {
      const key = `${transaction.categories.name}-${transaction.type}`
      const existing = acc.find((item) => item.key === key)

      if (existing) {
        existing.amount += Number(transaction.amount)
        existing.count += 1
      } else {
        acc.push({
          key,
          name: transaction.categories.name,
          icon: transaction.categories.icon,
          color: transaction.categories.color,
          type: transaction.type,
          amount: Number(transaction.amount),
          count: 1,
        })
      }

      return acc
    },
    [] as Array<{
      key: string
      name: string
      icon: string
      color: string
      type: "income" | "expense"
      amount: number
      count: number
    }>,
  )

  // Separate income and expenses
  const incomeData = categoryData.filter((item) => item.type === "income").sort((a, b) => b.amount - a.amount)
  const expenseData = categoryData.filter((item) => item.type === "expense").sort((a, b) => b.amount - a.amount)

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const CategorySection = ({
    title,
    data,
    total,
    emoji,
  }: {
    title: string
    data: typeof incomeData
    total: number
    emoji: string
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <span>{emoji}</span>
        <span>{title}</span>
        <span className="text-sm text-muted-foreground">({formatCurrency(total)})</span>
      </h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm">No {title.toLowerCase()} recorded</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const percentage = total > 0 ? (item.amount / total) * 100 : 0
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">({item.count} transactions)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Category Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">All-time spending and earning patterns</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <CategorySection title="Income Sources" data={incomeData} total={totalIncome} emoji="💰" />
        <CategorySection title="Expense Categories" data={expenseData} total={totalExpenses} emoji="💸" />
      </CardContent>
    </Card>
  )
}
