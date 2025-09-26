"use client"

import type React from "react"
import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, User, Mail, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSetup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [existingEmail, setExistingEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; password: string } | null>(null)
  const supabase = createBrowserClient()

  const createNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // Create new user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Failed to create user account")
        setLoading(false)
        return
      }

      // Wait a moment for the profile trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user role to admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authData.user.id)

      if (updateError) {
        console.log("Update error:", updateError)
        // Try to update by email if ID doesn't work
        const { error: updateError2 } = await supabase.from("profiles").update({ role: "admin" }).eq("email", email)

        if (updateError2) {
          setError("User created but failed to set admin role. Please try promoting manually.")
          setLoading(false)
          return
        }
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_user_id: authData.user.id,
        action_type: "admin_created",
        target_user_id: authData.user.id,
        details: { created_via: "setup_page_new_account" },
      })

      setAdminCredentials({ email, password })
      setSuccess(true)
    } catch (err) {
      console.error("Admin creation error:", err)
      setError("An unexpected error occurred.")
    }

    setLoading(false)
  }

  const promoteExistingUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", existingEmail)
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
        details: { created_via: "setup_page_promotion" },
      })

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred.")
    }

    setLoading(false)
  }

  const createDefaultAdmin = async () => {
    const defaultEmail = "admin@budgetwise.com"
    const defaultPassword = "admin123"

    setEmail(defaultEmail)
    setPassword(defaultPassword)
    setConfirmPassword(defaultPassword)

    // Auto-submit the form
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    await createNewAdmin(fakeEvent)
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
            {adminCredentials && (
              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2 text-primary">Your Admin Credentials:</h3>
                <p className="text-sm">
                  <strong>Email:</strong> {adminCredentials.email}
                </p>
                <p className="text-sm">
                  <strong>Password:</strong> {adminCredentials.password}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Save these credentials securely!</p>
              </div>
            )}
            <p className="text-muted-foreground">
              {adminCredentials ? "New admin account created" : `User ${existingEmail} promoted to admin`}
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/admin">Go to Admin Dashboard</a>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/auth/login">Login with Admin Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <Card className="glass-card max-w-lg w-full">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-primary">Create Admin User</CardTitle>
          <p className="text-muted-foreground">Set up admin access for BudgetWise</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new">New Admin</TabsTrigger>
              <TabsTrigger value="existing">Promote User</TabsTrigger>
              <TabsTrigger value="quick">Quick Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4">
              <form onSubmit={createNewAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Admin..." : "Create Admin Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="existing" className="space-y-4">
              <form onSubmit={promoteExistingUser} className="space-y-4">
                <div>
                  <Label htmlFor="existingEmail">User Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="existingEmail"
                      type="email"
                      value={existingEmail}
                      onChange={(e) => setExistingEmail(e.target.value)}
                      placeholder="Enter email of existing user"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">The user must have already signed up</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Promoting User..." : "Promote to Admin"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="quick" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Default Admin Credentials</h3>
                  <p className="text-sm">
                    <strong>Email:</strong> admin@budgetwise.com
                  </p>
                  <p className="text-sm">
                    <strong>Password:</strong> admin123
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">You can change these later</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={createDefaultAdmin} className="w-full" disabled={loading}>
                  {loading ? "Creating Default Admin..." : "Create Default Admin"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
