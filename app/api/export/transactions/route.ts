import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories (
          name,
          icon,
          color
        )
      `)
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = ["Date", "Type", "Category", "Description", "Amount"]
      const csvRows = transactions.map((t) => [
        t.date,
        t.type,
        t.categories.name,
        t.description || "",
        t.amount.toString(),
      ])

      const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="budgetwise-transactions-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    if (format === "json") {
      // Generate JSON report
      const report = {
        exportDate: new Date().toISOString(),
        user: user.email,
        transactions: transactions.map((t) => ({
          date: t.date,
          type: t.type,
          category: t.categories.name,
          description: t.description,
          amount: t.amount,
        })),
        summary: {
          totalTransactions: transactions.length,
          totalIncome: transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0),
          totalExpenses: transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0),
        },
      }

      return NextResponse.json(report, {
        headers: {
          "Content-Disposition": `attachment; filename="budgetwise-report-${new Date().toISOString().split("T")[0]}.json"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
