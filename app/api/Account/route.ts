import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/lib/snowflake";
import jwt from "jsonwebtoken";

async function getUsernameFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    return decoded.username;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  let connection: any;
  try {
    const username = await getUsernameFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    connection = await connect();
    const query = `
      SELECT "ID", "USERNAME", "EMAIL", "NAME", "PHONE", "CREATED_AT", "UPDATED_AT" 
      FROM "ACCOUNT_TEST" 
      WHERE UPPER("USERNAME") = UPPER(?);
    `;
    
    // Corrected execute call
    const rows = await new Promise<any[]>((resolve, reject) => {
        connection.execute({
            sqlText: query,
            binds: [username],
            complete: (err: any, stmt: any, rows: any) => {
                if (err) reject(err);
                else resolve(rows);
            }
        });
    });

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error("GET Account Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
}

export async function PATCH(req: NextRequest) {
  let connection: any;
  try {
    const username = await getUsernameFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone } = await req.json();
    if (!name && !phone) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    connection = await connect();
    let query = `UPDATE "ACCOUNT_TEST" SET `;
    const binds = [];

    if (name) {
      query += `"NAME" = ?, `;
      binds.push(name);
    }
    if (phone) {
      query += `"PHONE" = ?, `;
      binds.push(phone);
    }

    query += `"UPDATED_AT" = CURRENT_TIMESTAMP() WHERE UPPER("USERNAME") = UPPER(?);`;
    binds.push(username);

    // Corrected execute call
    await new Promise<void>((resolve, reject) => {
        connection.execute({
            sqlText: query,
            binds: binds,
            complete: (err: any) => {
                if(err) reject(err);
                else resolve();
            }
        });
    });

    return NextResponse.json({ message: "Account updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH Account Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
}