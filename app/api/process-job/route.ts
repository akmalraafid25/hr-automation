import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const jobPostSchema = z.object({
  title: z.string().describe("Job title/position name"),
  company: z.string().describe('Company name - use "Your Company" if not specified'),
  location: z.string().describe('Job location - use "Remote" if not specified'),
  type: z.string().describe("Employment type (Full-time, Part-time, Contract, etc.)"),
  salary: z.string().describe('Salary range or "Competitive" if not specified'),
  description: z.string().describe("Detailed job description"),
  requirements: z.array(z.string()).describe("List of job requirements and qualifications"),
})

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description) {
      return Response.json({ error: "Job description is required" }, { status: 400 })
    }

    const { object: jobPost } = await generateObject({
      model: openai("gpt-4o"),
      schema: jobPostSchema,
      prompt: `Extract and structure job posting information from this description. If company name or location aren't specified, use "Your Company" and "Remote" respectively. Make the job description professional and comprehensive based on the input:

"${description}"

Create a complete, professional job posting with all fields filled out appropriately.`,
    })

    return Response.json({ jobPost })
  } catch (error) {
    console.error("Error processing job description:", error)
    return Response.json({ error: "Failed to process job description" }, { status: 500 })
  }
}
