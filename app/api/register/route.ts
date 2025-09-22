import { connect } from "@/lib/snowflake";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let connection: any;
  try {
    const { username, password, email, name, phone } = await req.json();
    if (!username || !password || !email || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await connect();
    
    // Using quoted uppercase identifiers for maximum safety with Snowflake
    const query = `
      INSERT INTO "ACCOUNT_TEST" 
        ("USERNAME", "PASSWORD_HASH", "EMAIL", "NAME", "PHONE")
      VALUES (?, ?, ?, ?, ?);
    `;
    
    await connection.execute({
      sqlText: query,
      binds: [username, hashedPassword, email, name, phone],
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error: any) {
    // Check for unique constraint violation (username or email already exists)
    if (error.code === '23505' || (error.message && error.message.includes('unique constraint'))) {
       return NextResponse.json({ error: "Username or email already exists." }, { status: 409 });
    }
    console.error("Register API Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
}