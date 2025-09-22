"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import { CheckCircle, Clock, XCircle, FileText, TrendingUp, Users, Calendar } from "lucide-react"

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add dummy data if no real applications exist
    const dummyApplications = [
      {
        id: 1,
        jobName: "Senior Software Engineer",
        company: "SoftwareOne",
        appliedDate: new Date().toISOString(),
        status: "Under Review",
        progress: 75
      },
      {
        id: 2,
        jobName: "Frontend Developer",
        company: "SoftwareOne",
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Interview Scheduled",
        progress: 90
      },
      {
        id: 3,
        jobName: "Product Manager",
        company: "SoftwareOne",
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Under Review",
        progress: 45
      }
    ]
    
    fetch("/api/query/applications")
      .then((res) => res.json())
      .then((data) => {
        const appData = data?.rows || []
        const formattedApps = appData.map((app: any, index: number) => ({
          id: app.APPLICANT_ID || index,
          jobName: app.JOB_NAME || "Unknown Position",
          company: "SoftwareOne",
          appliedDate: app.APPLIED_DATE,
          status: app.STATUS || "Under Review",
          progress: app.PROGRESS || 50
        }))
        
        // Use dummy data if no real applications
        const finalApplications = formattedApps.length > 0 ? formattedApps : dummyApplications
        setApplications(finalApplications)
      })
      .catch((err) => {
        console.error("Error fetching applications:", err)
        // Use dummy data on error
        setApplications(dummyApplications)
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Under Review":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Interview Scheduled":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Under Review":
        return "secondary"
      case "Interview Scheduled":
        return "default"
      case "Rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) return <div className="p-8">Loading applications...</div>

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-2">Track the status of your job applications</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="flex items-center p-4">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Clock className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">{applications.filter(app => app.status === 'Under Review').length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{applications.length > 0 ? Math.round(applications.reduce((acc, app) => acc + app.progress, 0) / applications.length) : 0}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{app.jobName}</CardTitle>
                    <CardDescription>{app.company}</CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(app.status)} className="flex items-center gap-1">
                    {getStatusIcon(app.status)}
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Applied on:</span>
                    <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days since applied:</span>
                    <span>{Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Application Progress:</span>
                      <span>{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      Status updated: {new Date().toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}