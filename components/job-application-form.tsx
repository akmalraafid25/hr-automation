"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobApplicationFormProps {
  jobId: string
  jobName: string
  onClose: () => void
}

export function JobApplicationForm({ jobId, jobName, onClose }: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    credlyLink: ""
  })
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    fetch("/api/Account")
      .then(res => res.json())
      .then(data => {
        if (data.ID) {
          setAccountId(data.ID.toString())
          setFormData({
            fullName: data.NAME || "",
            email: data.EMAIL || "",
            phone: data.PHONE || "",
            credlyLink: ""
          })
        }
      })
      .catch(err => console.error("Error fetching account:", err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const submitData = new FormData()
    submitData.append("jobId", jobId)
    submitData.append("jobName", jobName)
    submitData.append("accountId", accountId || "")
    submitData.append("fullName", formData.fullName)
    submitData.append("email", formData.email)
    submitData.append("phone", formData.phone)
    submitData.append("credlyLink", formData.credlyLink)
    if (cvFile) {
      submitData.append("cv", cvFile)
    }

    try {
      const response = await fetch("/api/job-application", {
        method: "POST",
        body: submitData
      })

      if (response.ok) {
        alert("Application submitted successfully!")
        onClose()
      } else {
        alert("Failed to submit application")
      }
    } catch (error) {
      alert("Error submitting application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Apply for {jobName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="py-2">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="py-2">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="py-2">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="cv" className="py-2">CV/Resume *</Label>
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="credlyLink" className="py-2">Credly Link (Optional)</Label>
            <Input
              id="credlyLink"
              type="url"
              placeholder="https://www.credly.com/..."
              value={formData.credlyLink}
              onChange={(e) => setFormData({...formData, credlyLink: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}