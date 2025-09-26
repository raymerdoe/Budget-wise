"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BudgetGoal {
  id: string
  amount: number
  category_id: string
  categories: {
    name: string
    icon: string
    color: string
  }
}

interface Spending {
  category_id: string
  amount: number
}

interface BudgetGoalsListProps {
  budgetGoals: BudgetGoal[]
  currentSpending: Spending[]
}

export function BudgetGoalsList({ budgetGoals, currentSpending }: BudgetGoalsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getSpentAmount = (categoryId: string) => {
    return currentSpending
      .filter((spending) => spending.category_id === categoryId)
      .reduce((sum, spending) => sum + Number(spending.amount), 0)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage <= 50) return "bg-green-500"
    if (percentage <= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusBadge = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage <= 50) return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">On Track</Badge>
    if (percentage <= 80)
      return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">Warning</Badge>
    if (percentage <= 100) return <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300">Close</Badge>
    return <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">Over Budget</Badge>
  }

  if (budgetGoals.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No Budget Goals Set</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start by setting budget goals for your expense categories to track your spending and stay on target.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgetGoals.map((goal) => {
        const spent = getSpentAmount(goal.category_id)
        const percentage = (spent / goal.amount) * 100
        const remaining = Math.max(0, goal.amount - spent)

        return (
          <Card key={goal.id} className="glass-card hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{goal.categories.icon}</span>
                  <CardTitle className="text-lg">{goal.categories.name}</CardTitle>
                </div>
                {getStatusBadge(spent, goal.amount)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent</span>
                  <span className="font-medium">{formatCurrency(spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Budget</span>
                  <span className="font-medium">{formatCurrency(goal.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span
                    className={`font-medium ${remaining > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-3" />
              </div>

              {percentage > 100 && (
                <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Over budget by {formatCurrency(spent - goal.amount)}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
