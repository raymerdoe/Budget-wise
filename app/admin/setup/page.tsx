"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle } from "lucide-react"

export default function AdminSetup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const supabase = createBrowserClient()

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single()

      if (profileError || !profile) {
        setError("User not found. Make sure the user has signed up first.")
        setLoading(false)
        return
      }

      // Update user role to admin
      const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id)

      if (updateError) {
        setError("Failed to create admin user.")
        setLoading(false)
        return
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        action_type: "admin_created",
        target_user_id: profile.id,
        details: { created_via: "setup_page" },
      })

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred.")
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-primary">Admin Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">The user {email} has been granted admin privileges.</p>
            <Button asChild className="w-full">
              <a href="/admin">Go to Admin Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <Card className="glass-card max-w-md w-full">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-primary">Create Admin User</CardTitle>
          <p className="text-muted-foreground">Set up the first admin user for BudgetWise</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={createAdmin} className="space-y-4">
            <div>
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email of existing user"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">The user must have already signed up to BudgetWise</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Admin..." : "Create Admin User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
