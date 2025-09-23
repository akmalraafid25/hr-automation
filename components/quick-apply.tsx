"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Zap } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface QuickApplyProps {
  jobId: string
  jobName: string
}

export function QuickApply({ jobId, jobName }: QuickApplyProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { addToast } = useToast()

  const handleQuickApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate quick application
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      addToast({ 
        title: "Application Submitted", 
        description: `Quick application for ${jobName} submitted successfully!`, 
        variant: "success" 
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Quick Apply
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Apply</DialogTitle>
          <DialogDescription>
            Apply quickly to {jobName} with your saved profile
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleQuickApply} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 (555) 123-4567" required />
          </div>
          <div>
            <Label htmlFor="message">Cover Message (Optional)</Label>
            <Textarea id="message" placeholder="Brief message to the employer..." rows={3} />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}