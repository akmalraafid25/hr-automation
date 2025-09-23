"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ExternalLink } from "lucide-react"

export function JobRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Simulate fetching recommendations based on user profile
    fetch("/api/query/posts")
      .then(res => res.json())
      .then(data => {
        const jobs = data?.rows || []
        // Get random 3 jobs as recommendations
        const shuffled = jobs.sort(() => 0.5 - Math.random())
        setRecommendations(shuffled.slice(0, 3))
      })
      .catch(err => console.error("Error fetching recommendations:", err))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((job, index) => (
            <div key={index} className="p-3 border rounded-lg flex flex-col justify-between h-20">
              <h4 className={`font-semibold truncate ${job.JOB_NAME.length > 30 ? 'text-xs' : job.JOB_NAME.length > 20 ? 'text-sm' : 'text-base'}`}>{job.JOB_NAME}</h4>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {Math.floor(Math.random() * 30 + 70)}% Match
                </Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {recommendations.length === 0 && (
          <p className="text-muted-foreground text-sm">Loading recommendations...</p>
        )}
      </CardContent>
    </Card>
  )
}