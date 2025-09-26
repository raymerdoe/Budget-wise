"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: "income" | "expense"
}

interface AddTransactionDialogProps {
  categories: Category[]
}

export function AddTransactionDialog({ categories }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"income" | "expense">("expense")
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const filteredCategories = categories.filter((cat) => cat.type === type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        category_id: categoryId,
        amount: Number.parseFloat(amount),
        description: description.trim() || null,
        date,
        type,
      })

      if (error) throw error

      // Reset form
      setAmount("")
      setDescription("")
      setCategoryId("")
      setDate(new Date().toISOString().split("T")[0])
      setOpen(false)

      // Refresh the page to show new transaction
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add Transaction
          </DialogTitle>
          <DialogDescription>Track your income or expense</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => {
                setType("expense")
                setCategoryId("")
              }}
              className={type === "expense" ? "bg-red-600 hover:bg-red-700" : "border-red-600/30 hover:bg-red-600/10"}
            >
              💸 Expense
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => {
                setType("income")
                setCategoryId("")
              }}
              className={
                type === "income" ? "bg-green-600 hover:bg-green-700" : "border-green-600/30 hover:bg-green-600/10"
              }
            >
              💰 Income
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-background/50 border-primary/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
