import { NextRequest, NextResponse } from "next/server"
import snowflake from "snowflake-sdk"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let userEmail
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    userEmail = decoded.email
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  const jobId = req.nextUrl.searchParams.get("jobId")
  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 })
  }

  return new Promise<NextResponse>((resolve) => {
    const connection = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT!,
      username: process.env.SNOWFLAKE_USER!,
      authenticator: 'SNOWFLAKE_JWT',
      role: process.env.SNOWFLAKE_ROLE!,
      privateKey: process.env.SNOWFLAKE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      database: process.env.SNOWFLAKE_DATABASE!,
      schema: process.env.SNOWFLAKE_SCHEMA!,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
    })

    connection.connect((err) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }))
        return
      }

      connection.execute({
        sqlText: "SELECT STATUS FROM APPLICANT WHERE EMAIL = ? AND JOB_ID = ? ORDER BY APPLICANT_ID DESC LIMIT 1",
        binds: [userEmail, jobId],
        complete: (err, stmt, rows) => {
          if (err) {
            resolve(NextResponse.json({ error: err.message }, { status: 500 }))
          } else {
            const hasApplied = rows && rows.length > 0
            const status = hasApplied && rows ? rows[0].STATUS : null
            resolve(NextResponse.json({ hasApplied, status }))
          }
          connection.destroy(() => {})
        },
      })
    })
  })
}