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
        sqlText: "SELECT C.NAME, C.SKILLS, C.CERTIFICATION, C.WORK_EXPERIENCE, C.EDUCATION, J.JOB_NAME, S.ANALYSIS, S.PROS, S.CONS, S.SIMILARITY FROM SHORTLIST S LEFT JOIN CANDIDATE C ON C.CANDIDATE_ID = S.CANDIDATE_ID LEFT JOIN JOB_POST J ON S.JOB_ID = J.JOB_ID",
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
