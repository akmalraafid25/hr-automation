import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const jobDescription = await request.text()

    console.log("[v0] Received job description:", jobDescription)

    const jsonPayload = {
      text: jobDescription,
      timestamp: new Date().toISOString(),
      source: "job-creator-chatbot",
    }

    // Forward to actual n8n webhook
    const n8nWebhookUrl =
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      "https://hrautomationsupport.app.n8n.cloud/webhook-test/dd0754c0-f60c-44e9-b081-225ffb1791e7"

    console.log("[v0] Forwarding to n8n webhook:", n8nWebhookUrl)

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    })

    console.log("[v0] N8N response status:", n8nResponse.status)

    const n8nResult = await n8nResponse.text()
    console.log("[v0] N8N response body:", n8nResult)

    if (!n8nResponse.ok) {
      const errorMessage = `N8N webhook returned ${n8nResponse.status}: ${n8nResponse.statusText}${n8nResult ? ` - ${n8nResult}` : ""}`
      throw new Error(errorMessage)
    }

    let parsedResult = n8nResult
    try {
      // Try to parse as JSON first
      const jsonResult = JSON.parse(n8nResult)
      // If it's an object, extract meaningful content
      if (typeof jsonResult === "object" && jsonResult !== null) {
        parsedResult =
          jsonResult.message || jsonResult.result || jsonResult.output || JSON.stringify(jsonResult, null, 2)
      }
    } catch {
      // If not JSON, use as plain text
      parsedResult = n8nResult || "Job post processed successfully by n8n"
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job description sent to n8n successfully",
        result: parsedResult,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error forwarding to n8n:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error processing job post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
