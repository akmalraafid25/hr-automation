import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/lib/snowflake";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // avoid accidental prerendering


export async function POST(req: NextRequest) {
  let connection: any;
  try {
    // Check required environment variables
    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET environment variable");
      return new NextResponse("Server configuration error", { status: 500 });
    }
    
    const requiredEnvVars = [
      'SNOWFLAKE_ACCOUNT',
      'SNOWFLAKE_USER', 
      'SNOWFLAKE_PRIVATE_KEY',
      'SNOWFLAKE_DATABASE',
      'SNOWFLAKE_SCHEMA',
      'SNOWFLAKE_WAREHOUSE'
    ];
    
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    if (missing.length > 0) {
      console.error("Missing Snowflake environment variables:", missing);
      return new NextResponse(`Missing environment variables: ${missing.join(', ')}`, { status: 500 });
    }
    
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const ip_address = req.headers.get('x-forwarded-for') ?? 'unknown'; 

    if (!username || !password) {
      return new NextResponse("Missing username or password", { status: 400 });
    }

    console.log("Attempting to connect to Snowflake...");
    connection = await Promise.race([
      connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    console.log("Connected to Snowflake successfully");
    
    const userQuery = `SELECT * FROM "ACCOUNT_TEST" WHERE UPPER("USERNAME") = UPPER(?);`;
    
    // This is the corrected way to execute the query
    const rows = await new Promise<any[]>((resolve, reject) => {
      connection.execute({
        sqlText: userQuery,
        binds: [username],
        complete: (err: any, stmt: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      });
    });

    if (rows.length === 0) {
      return new NextResponse("Unauthorized: Invalid credentials", { status: 401 });
    }

    const user = rows[0] as any;

    const passwordMatch = await bcryptjs.compare(password, user.PASSWORD_HASH);
    if (!passwordMatch) {
      await connection.execute({
        sqlText: `INSERT INTO "LOGIN_ATTEMPTS_TEST" ("ACCOUNT_ID", "IS_SUCCESSFUL", "IP_ADDRESS") VALUES (?, ?, ?);`,
        binds: [user.ID, false, ip_address] 
      });
      return new NextResponse("Unauthorized: Invalid credentials", { status: 401 });
    }
    
    // Get role from database - check if user has ROLE column
    const userRole = user.ROLE || 'USER'
    
    const token = jwt.sign(
      { id: user.ID, username: user.USERNAME, name: user.NAME, email: user.EMAIL, role: userRole },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Redirect based on role
    const redirectUrl = userRole === 'ADMIN' ? "/" : "/jobs"
    const res = NextResponse.redirect(new URL(redirectUrl, req.url))
    
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
    
    await connection.execute({
      sqlText: `INSERT INTO "LOGIN_ATTEMPTS_TEST" ("ACCOUNT_ID", "IS_SUCCESSFUL", "IP_ADDRESS") VALUES (?, ?, ?);`,
      binds: [user.ID, true, ip_address]
    });
    
    return res;

  } catch (error: any) {
    console.error("Login API Error:", error.message);
    console.error("Full error:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  } finally {
    if (connection) {
      connection.destroy(() => {});
    }
  }
}