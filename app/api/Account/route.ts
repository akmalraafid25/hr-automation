import { NextRequest, NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function GET(req: NextRequest) {
  try {
    const connection = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT!,
      username: process.env.SNOWFLAKE_USER!,
      privateKey: process.env.SNOWFLAKE_PRIVATE_KEY,
      privateKeyPass: process.env.SNOWFLAKE_PRIVATE_KEY_PASSPHRASE,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      role: process.env.SNOWFLAKE_ROLE,
    });

    await new Promise<void>((resolve, reject) => {
      connection.connect((err, conn) => {
        if (err) {
          console.error("Unable to connect to Snowflake:", err);
          reject(err);
        } else {
          console.log("Successfully connected to Snowflake.");
          resolve();
        }
      });
    });

    const query = "SELECT * FROM account;";
    const rows = await new Promise<any[]>((resolve, reject) => {
      connection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error("Failed to execute statement:", err);
            reject(err);
          } else {
            console.log("Successfully executed statement.");
            resolve(rows);
          }
        },
      });
    });

    await new Promise<void>((resolve, reject) => {
      connection.destroy((err, conn) => {
        if (err) {
          console.error("Unable to disconnect from Snowflake:", err);
          reject(err);
        } else {
          console.log("Successfully disconnected from Snowflake.");
          resolve();
        }
      });
    });

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}