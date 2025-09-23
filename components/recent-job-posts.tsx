"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock } from "lucide-react"

export function RecentJobPosts() {
  const [jobPosts, setJobPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/posts")
      .then(res => res.json())
      .then(data => {
        const posts = data?.rows?.slice(0, 3) || []
        setJobPosts(posts)
      })
      .catch(err => console.error("Error fetching job posts:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Job Posts</CardTitle>
        <CardDescription>Latest job openings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobPosts.map((job, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{job.JOB_NAME}</h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(job.DATE_CREATED).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Ends: {new Date(job.END_DATE).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}