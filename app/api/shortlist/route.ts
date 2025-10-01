import { NextRequest, NextResponse } from "next/server"
import snowflake from "snowflake-sdk"

export async function POST(req: NextRequest) {
  console.log("➡️ API /api/shortlist POST called");

  return new Promise((resolve) => {
    const connection = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USER,
      authenticator: 'SNOWFLAKE_JWT',
      role: process.env.SNOWFLAKE_ROLE,
      privateKey: process.env.SNOWFLAKE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    })

    connection.connect(async (err) => {
      if (err) {
        console.error("❌ Connection failed:", err.message)
        resolve(NextResponse.json({ error: err.message }, { status: 500 }))
        return
      }

      try {
        const { applicantId, jobId } = await req.json()
        console.log("Shortlisting:", { applicantId, jobId })
        // Insert into SHORTLIST table using JOB_ID from APPLICANT table
        connection.execute({
          sqlText: "INSERT INTO SHORTLIST (APPLICANT_ID, JOB_ID, SHORTLISTED_DATE) VALUES (?, ?, CURRENT_TIMESTAMP())",
          binds: [applicantId, jobId || null],
          complete: (err, stmt, rows) => {
            if (err) {
              console.error("❌ Insert failed:", err.message)
              resolve(NextResponse.json({ error: err.message }, { status: 500 }))
            } else {
              resolve(NextResponse.json({ success: true }, { status: 200 }))
            }

                connection.destroy((destroyErr) => {
                  if (destroyErr) {
                    console.error("⚠ Error closing connection:", destroyErr.message)
                  }
                })
              },
            })
          },
        })
      } catch (error: any) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }))
        connection.destroy()
      }
    })
  })
}

export async function DELETE(req: NextRequest) {
  return new Promise((resolve) => {
    const connection = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USER,
      authenticator: 'SNOWFLAKE_JWT',
      role: process.env.SNOWFLAKE_ROLE,
      privateKey: process.env.SNOWFLAKE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    })

    connection.connect(async (err) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }))
        return
      }

      try {
        const { shortlistId } = await req.json()

        connection.execute({
          sqlText: "DELETE FROM SHORTLIST WHERE SHORTLIST_ID = ?",
          binds: [shortlistId],
          complete: (err, stmt, rows) => {
            if (err) {
              resolve(NextResponse.json({ error: err.message }, { status: 500 }))
            } else {
              resolve(NextResponse.json({ success: true }, { status: 200 }))
            }
            connection.destroy()
          },
        })
      } catch (error: any) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }))
        connection.destroy()
      }
    })
  })
}