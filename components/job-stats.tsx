"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Clock, MapPin, Users } from "lucide-react"

interface JobStatsProps {
  totalJobs: number
  activeJobs: number
  newJobs: number
}

export function JobStats({ totalJobs, activeJobs, newJobs }: JobStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center p-4">
          <Briefcase className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <p className="text-2xl font-bold">{totalJobs}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          <Clock className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">{activeJobs}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          <Users className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">New Today</p>
            <p className="text-2xl font-bold">{newJobs}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          <MapPin className="h-8 w-8 text-purple-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Remote</p>
            <p className="text-2xl font-bold">{Math.floor(totalJobs * 0.3)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}