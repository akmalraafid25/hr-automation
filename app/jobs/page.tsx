"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import { JobSearch } from "@/components/job-search"
import { SavedJobs } from "@/components/saved-jobs"
import { JobStats } from "@/components/job-stats"
import { JobAlerts } from "@/components/job-alerts"

import { QuickApply } from "@/components/quick-apply"
import { useRouter } from "next/navigation"
import { debounce } from "@/lib/utils"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<{[key: string]: any}>({})
  const router = useRouter()

  useEffect(() => {
    fetch("/api/query/posts")
      .then((res) => res.json())
      .then((data) => {
        const jobData = data?.rows || []
        setJobs(jobData)
        setFilteredJobs(jobData)
        
        // Check application status for each job
        jobData.forEach((job: any) => {
          fetch(`/api/check-application?jobId=${job.JOB_ID}`)
            .then(res => res.json())
            .then(appData => {
              setApplicationStatus(prev => ({
                ...prev,
                [job.JOB_ID]: appData
              }))
            })
            .catch(() => {})
        })
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = useCallback(
    debounce((query: string, location: string, type: string) => {
      let filtered = jobs
      if (query) {
        filtered = filtered.filter(job => 
          job.JOB_NAME.toLowerCase().includes(query.toLowerCase())
        )
      }
      setFilteredJobs(filtered)
    }, 300),
    [jobs]
  )

  const { activeJobs, newJobs } = useMemo(() => {
    const active = jobs.filter(job => new Date(job.END_DATE) > new Date()).length
    const newCount = jobs.filter(job => {
      const created = new Date(job.DATE_CREATED)
      const today = new Date()
      return created.toDateString() === today.toDateString()
    }).length
    return { activeJobs: active, newJobs: newCount }
  }, [jobs])

  if (loading) return <div className="p-8">Loading jobs...</div>

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-20 md:pt-24">
        <div className="bg-cover bg-[url(/light-refraction-getty-912442750-cta-banner.jpg)] p-16 mb-6 md:mb-8">
          <h1 className="text-secondary text-2xl md:text-4xl font-bold">Open Positions</h1>
          <p className="text-secondary mt-2">Find your next career opportunity</p>
        </div>

        <div className="mb-6">
          <JobSearch onSearch={handleSearch} />
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              {filteredJobs.map((job, index) => (
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              {filteredJobs.map((job, index) => {
                const isExpired = new Date(job.END_DATE) < new Date()
                return (
<<<<<<< HEAD
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            <Card key={job.JOB_ID || index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{job.JOB_NAME}</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                    <Button 
                      className="w-full" 
                      variant={applicationStatus[job.JOB_ID]?.hasApplied && applicationStatus[job.JOB_ID]?.status !== 'Rejected' && applicationStatus[job.JOB_ID]?.status !== 'Hired' ? "secondary" : "default"}
                    >
                      {applicationStatus[job.JOB_ID]?.hasApplied && applicationStatus[job.JOB_ID]?.status !== 'Rejected' && applicationStatus[job.JOB_ID]?.status !== 'Hired' ? "Applied" : "View Details & Apply"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl mx-4 md:mx-0">
                    <DialogHeader>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                      <DialogTitle>{job.JOB_NAME}</DialogTitle>
                      <DialogDescription>
                        Application Period: {new Date(job.START_DATE).toLocaleDateString()} - {new Date(job.END_DATE).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-full rounded-md border p-4">
                      <ReactMarkdown>{job.PROMPT}</ReactMarkdown>
                    </ScrollArea>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1" 
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/check-application?jobId=${job.JOB_ID}`);
                            const data = await res.json();
                            if (data.hasApplied && data.status !== 'Rejected' && data.status !== 'Hired') {
                              alert('You have already applied to this position. Please wait for the current application to be processed.');
                            } else {
                              router.push(`/apply?jobId=${job.JOB_ID}&jobName=${encodeURIComponent(job.JOB_NAME)}`);
                            }
                          } catch (error) {
                            router.push(`/apply?jobId=${job.JOB_ID}&jobName=${encodeURIComponent(job.JOB_NAME)}`);
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                      <QuickApply jobId={job.JOB_ID} jobName={job.JOB_NAME} />
                      <SavedJobs jobId={job.JOB_ID} jobName={job.JOB_NAME} />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
              ))}
=======
              {filteredJobs.map((job, index) => {
                const isExpired = new Date(job.END_DATE) < new Date()
                return (
                  <Card key={job.JOB_ID || index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                      <DialogTitle className="flex items-center gap-2">
=======
                  <Card key={job.JOB_ID || index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">
>>>>>>> 362ee52f2e67fca7082a3fef7a9dbf29ea527a6f
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                        {job.JOB_NAME}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {new Date(job.START_DATE).toLocaleDateString()}
                        </Badge>
                        <Badge variant={isExpired ? "destructive" : "outline"}>
                          Ends: {new Date(job.END_DATE).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4">
                        Posted: {new Date(job.DATE_CREATED).toLocaleDateString()}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            variant={applicationStatus[job.JOB_ID]?.hasApplied && applicationStatus[job.JOB_ID]?.status !== 'Rejected' && applicationStatus[job.JOB_ID]?.status !== 'Hired' ? "secondary" : "default"}
                          >
                            {applicationStatus[job.JOB_ID]?.hasApplied && applicationStatus[job.JOB_ID]?.status !== 'Rejected' && applicationStatus[job.JOB_ID]?.status !== 'Hired' ? "Applied" : "View Details & Apply"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl mx-4 md:mx-0">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {job.JOB_NAME}
                              {isExpired && <span className="text-red-500 text-sm">🔒 EXPIRED</span>}
                            </DialogTitle>
                            <DialogDescription>
                              Application Period: {new Date(job.START_DATE).toLocaleDateString()} - {new Date(job.END_DATE).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-96 w-full rounded-md border p-4">
                            <ReactMarkdown>{job.PROMPT}</ReactMarkdown>
                          </ScrollArea>
                          <div className="flex gap-2 pt-4">
                            <Button 
                              className="flex-1" 
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/check-application?jobId=${job.JOB_ID}`);
                                  const data = await res.json();
                                  if (data.hasApplied && data.status !== 'Rejected' && data.status !== 'Hired') {
                                    alert('You have already applied to this position. Please wait for the current application to be processed.');
                                  } else {
                                    router.push(`/apply?jobId=${job.JOB_ID}&jobName=${encodeURIComponent(job.JOB_NAME)}`);
                                  }
                                } catch (error) {
                                  router.push(`/apply?jobId=${job.JOB_ID}&jobName=${encodeURIComponent(job.JOB_NAME)}`);
                                }
                              }}
                            >
                              {isExpired ? '🔒 Application Closed' : 'Apply Now'}
                            </Button>
                            <div className={isExpired ? 'opacity-50 pointer-events-none' : ''}>
                              <QuickApply jobId={job.JOB_ID} jobName={job.JOB_NAME} />
                            </div>
                            <SavedJobs jobId={job.JOB_ID} jobName={job.JOB_NAME} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                )
              })}
>>>>>>> Stashed changes
            </div>
          </div>
        </div>

        {filteredJobs.length === 0 && jobs.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs match your search criteria.</p>
          </div>
        )}
        
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No open positions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}