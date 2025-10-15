import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const jobId = formData.get("jobId") as string
    const jobName = formData.get("jobName") as string
    const accountId = formData.get("accountId") as string
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const credlyLink = formData.get("credlyLink") as string
    const cvFile = formData.get("cv") as File

    // Prepare webhook payload as FormData to send binary file
    const webhookFormData = new FormData()
    webhookFormData.append("jobId", jobId)
    webhookFormData.append("jobName", jobName)
    webhookFormData.append("accountId", accountId)
    webhookFormData.append("fullName", fullName)
    webhookFormData.append("email", email)
    webhookFormData.append("phone", phone)
    webhookFormData.append("credlyLink", credlyLink)
    webhookFormData.append("submittedAt", new Date().toISOString())
    
    if (cvFile) {
      webhookFormData.append("cv", cvFile)
    }

    // Send to webhook
    const webhookUrl = process.env.JOB_APPLICATION_WEBHOOK_URL || "https://hr-automation.duckdns.org/webhook/b7725152-c75b-47ec-abe3-a091babc9f3d"
    
    await fetch(webhookUrl, {
      method: "POST",
      body: webhookFormData
    })

    return NextResponse.json({ message: "Application submitted successfully" })
  } catch (error) {
    console.error("Error processing application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}