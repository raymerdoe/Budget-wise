"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target, TrendingUp } from "lucide-react"
import { ExportDialog } from "@/components/export/export-dialog"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/dashboard/transactions?action=add">
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>

        <Link href="/dashboard/goals">
          <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 bg-transparent">
            <Target className="mr-2 h-4 w-4" />
            Set Budget Goal 🎯
          </Button>
        </Link>

        <Link href="/dashboard/analytics">
          <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 bg-transparent">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics 📊
          </Button>
        </Link>

        <ExportDialog />
      </CardContent>
    </Card>
  )
}
