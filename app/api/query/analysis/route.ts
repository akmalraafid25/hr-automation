import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function GET() {
  console.log("➡️ API /api/query called");

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
        sqlText: "SELECT S.SHORTLIST_ID, A.APPLICANT_ID, A.NAME, A.SKILLS, A.CERTIFICATION, A.WORK_EXPERIENCE, A.EDUCATION, J.JOB_NAME, analysis.ANALYSIS, analysis.PROS, analysis.CONS, analysis.SIMILARITY, A.STATUS FROM ANALYSIS analysis LEFT JOIN APPLICANT A ON A.APPLICANT_ID = analysis.APPLICANT_ID LEFT JOIN SHORTLIST S ON A.APPLICANT_ID = S.APPLICANT_ID LEFT JOIN JOB_POST J ON analysis.JOB_ID = J.JOB_ID",
        complete: (err, stmt, rows) => {
          console.log("➡️ Query callback fired");

          if (err) {
            console.error("❌ Query failed:", err.message);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            console.log("✅ Query success");
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

export async function PUT(request: Request) {
  const { applicantId, status } = await request.json();

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
    });

    connection.connect((err) => {
      if (err) {
        console.error("❌ Connection failed:", err.message);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      connection.execute({
        sqlText: "UPDATE APPLICANT SET STATUS = ? WHERE APPLICANT_ID = ?",
        binds: [status, applicantId],
        complete: (err, stmt, rows) => {
          if (err) {
            console.error("❌ Update failed:", err.message);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ success: true }, { status: 200 }));
          }

          connection.destroy((destroyErr) => {
            if (destroyErr) {
              console.error("⚠️ Error closing connection:", destroyErr.message);
            }
          });
        },
      });
    });
  });
}
