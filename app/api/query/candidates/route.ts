import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log("➡️ API /api/query called");

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
    });

    console.log("➡️ Creating connection...");

    connection.connect((err) => {
      if (err) {
        console.error("❌ Connection failed:", err.message);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      console.log("✅ Connected to Snowflake, running query...");

      connection.execute({
        sqlText: "SELECT A.NAME, A.APPLICANT_ID as APPLICANT_ID, A.CV_URL, A.EMAIL, A.PHONE, A.LINKEDIN, A.SKILLS, A.CERTIFICATION, A.WORK_EXPERIENCE, A.EDUCATION, A.STATUS, analysis.SIMILARITY, J.JOB_ID, J.JOB_NAME FROM APPLICANT A LEFT JOIN ANALYSIS analysis on A.APPLICANT_ID = analysis.applicant_id LEFT Join JOB_POST J on A.JOB_ID = J.JOB_ID LEFT JOIN SHORTLIST S ON A.APPLICANT_ID = S.APPLICANT_ID",
        complete: (err, stmt, rows) => {
          console.log("➡️ Query callback fired");

          if (err) {
            console.error("❌ Query failed:", err.message);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            console.log("✅ Query success:");
            resolve(NextResponse.json({ rows }, { status: 200 }));
          }

          connection.destroy((destroyErr) => {
            if (destroyErr) {
              console.error("⚠️ Error closing connection:", destroyErr.message);
            } else {
              console.log("🔌 Connection closed");
            }
          });
        },
      });
    });
  });
}