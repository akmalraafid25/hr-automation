import { NextResponse, NextRequest } from "next/server";
import snowflake from "snowflake-sdk";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  console.log("➡️ API /api/query/applications called");

  // Get user from JWT token
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userEmail;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    userEmail = decoded.email;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

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

      console.log("✅ Connected to Snowflake, running applications query...");

      connection.execute({
        sqlText: "SELECT A.APPLICANT_ID, A.NAME, A.EMAIL, J.JOB_NAME, CURRENT_DATE() as APPLIED_DATE, COALESCE(A.STATUS, 'Under Review') as STATUS, CASE WHEN A.STATUS = 'Pending' THEN 25 WHEN A.STATUS = 'Reviewed' THEN 50 WHEN A.STATUS = 'Interview' THEN 75 WHEN A.STATUS = 'Assessment' THEN 80 WHEN A.STATUS = 'Offering' THEN 90 WHEN A.STATUS = 'Hired' THEN 100 WHEN A.STATUS = 'Rejected' THEN 0 ELSE 25 END as PROGRESS FROM APPLICANT A LEFT JOIN JOB_POST J ON A.JOB_ID = J.JOB_ID WHERE A.EMAIL = ?",
        binds: [userEmail],
        complete: (err, stmt, rows) => {
          console.log("➡️ Applications query callback fired");

          if (err) {
            console.error("❌ Applications query failed:", err.message);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            console.log("✅ Applications query success");
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