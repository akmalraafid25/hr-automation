"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Briefcase, FileText, UserCheck } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState([
    { title: "Total Applications", value: "0", icon: FileText },
    { title: "Active Job Posts", value: "0", icon: Briefcase },
    { title: "Total Candidates", value: "0", icon: Users },
    { title: "Hired Candidates", value: "0", icon: UserCheck },
  ])

  useEffect(() => {
    // Fetch applications count
    fetch("/api/query/candidates")
      .then(res => res.json())
      .then(data => {
        const candidates = data?.rows?.length || 0
        
        // Fetch job posts count
        return fetch("/api/query/posts")
          .then(res => res.json())
          .then(jobData => {
            const jobPosts = jobData?.rows?.length || 0
            
            // Fetch analysis data for hired count
            return fetch("/api/query/analysis")
              .then(res => res.json())
              .then(analysisData => {
                const hired = analysisData?.rows?.filter((row: any) => row.STATUS === 'Hired')?.length || 0
                
                setStats([
                  { title: "Total Applications", value: candidates.toString(), icon: FileText },
                  { title: "Active Job Posts", value: jobPosts.toString(), icon: Briefcase },
                  { title: "Total Candidates", value: candidates.toString(), icon: Users },
                  { title: "Hired Candidates", value: hired.toString(), icon: UserCheck },
                ])
              })
          })
      })
      .catch(err => console.error("Error fetching stats:", err))
  }, [])

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card className="gap-2" key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-3xl font-bold text-balance">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
