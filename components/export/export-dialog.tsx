"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table } from "lucide-react"

export function ExportDialog() {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState("csv")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/export/transactions?format=${format}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `budgetwise-export-${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "json"}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setOpen(false)
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Export Your Data 📊
          </DialogTitle>
          <DialogDescription>Choose a format to download your transaction data</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Table className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">CSV Spreadsheet</div>
                  <div className="text-sm text-muted-foreground">Perfect for Excel, Google Sheets</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center space-x-3 cursor-pointer flex-1">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">JSON Report</div>
                  <div className="text-sm text-muted-foreground">Detailed report with summary stats</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isExporting ? "Exporting..." : "Download Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
