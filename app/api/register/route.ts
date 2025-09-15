import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connection from "@/lib/snowflake";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve) => {
    connection.execute({
      sqlText: `INSERT INTO USERS (EMAIL, PASSWORD_HASH, NAME) VALUES (?, ?, ?)`,
      binds: [email, hashedPassword, name],
      complete: function (err) {
        if (err) {
          resolve(NextResponse.json({ error: "User already exists" }, { status: 400 }));
        } else {
          resolve(NextResponse.json({ message: "User registered" }));
        }
      },
    });
  });
}
