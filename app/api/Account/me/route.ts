import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import snowflake from "snowflake-sdk";

export async function GET() {
  console.log("🔍 /api/account/me hit");

  try {
    // ✅ FIX 1: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("🔑 Token:", token);

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    console.log("👤 Decoded:", decoded);

    // ✅ FIX 2: Create new connection for this request
    const connection = snowflake.createConnection({
        account: process.env.SNOWFLAKE_ACCOUNT!,
        username: process.env.SNOWFLAKE_USER!,
        authenticator: "SNOWFLAKE_JWT",
        role: process.env.SNOWFLAKE_ROLE,
        privateKey: process.env.SNOWFLAKE_PRIVATE_KEY,
        database: process.env.SNOWFLAKE_DATABASE,
        schema: process.env.SNOWFLAKE_SCHEMA,
        warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    });

    await new Promise<void>((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error("❌ Snowflake connect error:", err);
          reject(err);
        } else {
          console.log("✅ Snowflake connected");
          resolve();
        }
      });
    });

    const rows: any = await new Promise((resolve, reject) => {
      connection.execute({
        sqlText: `SELECT * FROM ACCOUNT_TEST WHERE USERNAME = ?`,
        binds: [decoded.username],
        complete: (err, stmt, result) => {
          if (err) {
            console.error("❌ Snowflake query error:", err);
            reject(err);
          } else {
            console.log("📦 Query result:", result);
            resolve(result);
          }
        },
      });
    });

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: rows[0] });
  } catch (err: any) {
    console.error("💥 API crash:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
