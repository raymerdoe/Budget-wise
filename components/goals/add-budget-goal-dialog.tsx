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
import { Target } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface AddBudgetGoalDialogProps {
  categories: Category[]
}

export function AddBudgetGoalDialog({ categories }: AddBudgetGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const { error } = await supabase.from("budget_goals").insert({
        user_id: user.id,
        category_id: categoryId,
        amount: Number.parseFloat(amount),
        month: currentMonth,
        year: currentYear,
      })

      if (error) throw error

      // Reset form
      setAmount("")
      setCategoryId("")
      setOpen(false)

      // Refresh the page to show new goal
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
          <Target className="mr-2 h-4 w-4" />
          Set Budget Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Set Budget Goal 🎯
          </DialogTitle>
          <DialogDescription>Set a monthly spending limit for a category</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-background/50 border-primary/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
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
            <Label htmlFor="amount">Monthly Budget Limit</Label>
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
            {isLoading ? "Setting Goal..." : "Set Budget Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
