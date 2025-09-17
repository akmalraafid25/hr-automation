import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function GET() {
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
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      connection.execute({
        sqlText: `
          SELECT 
            A.APPLICANT_ID,
            A.NAME,
            A.EMAIL,
            J.JOB_NAME,
            A.CREATED_AT as APPLIED_DATE,
            'Under Review' as STATUS,
            60 as PROGRESS
          FROM APPLICANT A 
          LEFT JOIN JOB_POST J ON A.JOB_ID = J.JOB_ID
          ORDER BY A.CREATED_AT DESC
        `,
        complete: (err, stmt, rows) => {
          if (err) {
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ rows }, { status: 200 }));
          }

          connection.destroy((destroyErr) => {
            if (destroyErr) {
              console.error("Error closing connection:", destroyErr.message);
            }
          });
        },
      });
    });
  });
}