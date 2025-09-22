"use client"

import { useState, FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { RegisterForm } from "@/components/register-form"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
      credentials: "include", // make sure cookie is set
    })
  
    if (res.ok || res.status === 303 || res.status === 307) {
      // 🔹 Force full page navigation so middleware sees cookie
      window.location.href = "/"  // <--- this triggers real browser navigation
    } else {
      setLoading(false)
      alert("Your password is incorrect or account doesn't exists")
    }
  }



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setShowRegister(true)}>
                  Register Now
                </Button>
              </div>
            </div>
          </form>

          <div className="relative hidden md:block">
            <img
              src="/login-bg.jpg"
              alt="Image"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="max-w-md">
          <RegisterForm onClose={() => setShowRegister(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
