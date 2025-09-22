"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { ApplicantNavbar } from "@/components/applicant-navbar"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/posts")
      .then((res) => res.json())
      .then((data) => {
        const jobData = data?.rows || []
        setJobs(jobData)
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Loading jobs...</div>

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Open Positions</h1>
          <p className="text-muted-foreground mt-2">Find your next career opportunity</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{job.JOB_NAME}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {new Date(job.START_DATE).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline">
                    Ends: {new Date(job.END_DATE).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Posted: {new Date(job.DATE_CREATED).toLocaleDateString()}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">View Details & Apply</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{job.JOB_NAME}</DialogTitle>
                      <DialogDescription>
                        Application Period: {new Date(job.START_DATE).toLocaleDateString()} - {new Date(job.END_DATE).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full rounded-md border p-4">
                      <ReactMarkdown>{job.PROMPT}</ReactMarkdown>
                    </ScrollArea>
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline">Save Job</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No open positions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}