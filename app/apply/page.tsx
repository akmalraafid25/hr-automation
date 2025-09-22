"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import { JobApplicationForm } from "@/components/job-application-form"

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const jobId = searchParams.get("jobId") || ""
  const jobName = searchParams.get("jobName") || ""

  const handleClose = () => {
    router.push("/jobs")
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar />
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="mt-16 text-3xl font-bold">Job Application</h1>
          <p className="text-muted-foreground mt-2">Complete your application below</p>
        </div>
        
        <div className="flex justify-center">
          <JobApplicationForm
            jobId={jobId}
            jobName={jobName}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}