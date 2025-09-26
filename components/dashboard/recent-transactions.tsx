import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: "income" | "expense"
  categories: {
    name: string
    icon: string
    color: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Recent Transactions
        </CardTitle>
        <Link href="/dashboard/transactions">
          <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 bg-transparent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💳</div>
            <p className="text-muted-foreground mb-4">No transactions yet</p>
            <Link href="/dashboard/transactions">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Add Your First Transaction
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{transaction.categories.icon}</div>
                  <div>
                    <p className="font-medium">{transaction.description || transaction.categories.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)} • {transaction.categories.name}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
