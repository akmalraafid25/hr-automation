"use client"

import { useState, FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps extends React.ComponentProps<"div"> {
  onClose: () => void
}

export function RegisterForm({ className, onClose, ...props }: RegisterFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      name: formData.get("name"),
      phone: formData.get("phone")
    }
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  
    if (res.ok) {
      alert("Account created successfully! Please login.")
      onClose()
    } else {
      const error = await res.json()
      alert(error.error || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-balance">
                  Join us today
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating..." : "Register"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}