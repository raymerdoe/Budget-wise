"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportDialog } from "@/components/export/export-dialog"
import { useState } from "react"

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

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.categories.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 bg-background/50 border-primary/20">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
            <ExportDialog />
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Transactions</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first transaction"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{transaction.categories.icon}</div>
                    <div>
                      <p className="font-medium text-lg">{transaction.description || transaction.categories.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)} • {transaction.categories.name}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold text-xl ${
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
    </div>
  )
}
