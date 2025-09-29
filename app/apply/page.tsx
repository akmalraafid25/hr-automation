"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ApplicantNavbar } from "@/components/applicant-navbar"
import { JobApplicationForm } from "@/components/job-application-form"

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const jobId = searchParams.get("job_id") || searchParams.get("jobId") || ""
  const jobName = searchParams.get("job_name") || searchParams.get("jobName") || ""
  
  console.log("Apply page - jobId:", jobId, "jobName:", jobName)
  console.log("All search params:", Object.fromEntries(searchParams.entries()))

  const handleClose = () => {
    router.push("/jobs")
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicantNavbar/>
      <div className="max-w-2xl mx-auto p-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Job Application</h1>
          <p className="text-muted-foreground mt-2">Complete your application below</p>
        </div>
        
        <JobApplicationForm
          jobId={jobId}
          jobName={jobName}
          onClose={handleClose}
        />
      </div>
    </div>
  )
}