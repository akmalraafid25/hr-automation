"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface SavedJobsProps {
  jobId?: string
  jobName?: string
}

export function SavedJobs({ jobId, jobName }: SavedJobsProps) {
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const { addToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs")
    if (saved) {
      setSavedJobs(JSON.parse(saved))
    }
  }, [])

  const toggleSaveJob = (id: string, name: string) => {
    let updated
    if (savedJobs.includes(id)) {
      updated = savedJobs.filter(jobId => jobId !== id)
      addToast({ title: "Job Removed", description: `${name} removed from saved jobs`, variant: "default" })
    } else {
      updated = [...savedJobs, id]
      addToast({ title: "Job Saved", description: `${name} saved successfully`, variant: "success" })
    }
    
    setSavedJobs(updated)
    localStorage.setItem("savedJobs", JSON.stringify(updated))
  }

  const isSaved = (id: string) => savedJobs.includes(id)

  if (jobId && jobName) {
    return (
      <Button 
        variant="outline" 
        onClick={() => toggleSaveJob(jobId, jobName)}
        className="flex items-center gap-2"
      >
        {isSaved(jobId) ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            Save Job
          </>
        )}
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Saved Jobs ({savedJobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedJobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No saved jobs yet</p>
        ) : (
          <div className="space-y-2">
            {savedJobs.slice(0, 3).map((jobId, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Job #{jobId}</span>
                <Badge variant="outline">Saved</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}