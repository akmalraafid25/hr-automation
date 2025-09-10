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
        sqlText: "SELECT C.CANDIDATE_ID as CANDIDATE_ID, C.NAME, J.JOB_NAME as JOB_NAME, C.EMAIL, C.PHONE, C.LINKEDIN, C.SKILLS, C.CERTIFICATION, C.WORK_EXPERIENCE, C.EDUCATION FROM CANDIDATE C LEFT JOIN JOB_POST j on c.job_id = j.job_id",
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
