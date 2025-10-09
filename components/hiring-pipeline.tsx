"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PipelineStage {
  stage: string
  count: number
  percentage: number
}

interface Candidate {
  STATUS?: string
}

export function HiringPipeline() {
  const [pipelineData, setPipelineData] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/query/analysis")
      .then(res => res.json())
      .then(data => {
        const candidates = data?.rows || []
        const total = candidates.length
        
        const statusCounts = candidates.reduce((acc: Record<string, number>, candidate: Candidate) => {
          const status = candidate.STATUS || 'Under Review'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        const pipeline = [
          { stage: "Pending", count: statusCounts['Pending'] || 0, percentage: ((statusCounts['Pending'] || 0) / total) * 100 },
          { stage: "Reviewed", count: statusCounts['Reviewed'] || 0, percentage: ((statusCounts['Reviewed'] || 0) / total) * 100 },
          { stage: "Interview", count: statusCounts['Interview'] || 0, percentage: ((statusCounts['Interview'] || 0) / total) * 100 },
          { stage: "Assessment", count: statusCounts['Assessment'] || 0, percentage: ((statusCounts['Assessment'] || 0) / total) * 100 },
          { stage: "Offering", count: statusCounts['Offering'] || 0, percentage: ((statusCounts['Offering'] || 0) / total) * 100 },
          { stage: "Hired", count: statusCounts['Hired'] || 0, percentage: ((statusCounts['Hired'] || 0) / total) * 100 },
          { stage: "Rejected", count: statusCounts['Rejected'] || 0, percentage: ((statusCounts['Rejected'] || 0) / total) * 100 },
        ]
        
        setPipelineData(pipeline)
      })
      .catch(err => console.error("Error fetching pipeline data:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
        <CardDescription>Candidate progression through stages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipelineData.map((stage, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{stage.stage}</span>
              <span className="text-muted-foreground">{stage.count} candidates</span>
            </div>
            <Progress value={stage.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}