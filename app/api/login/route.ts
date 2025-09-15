import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectSnowflake } from "@/lib/snowflake";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const conn = await connectSnowflake();

  return new Promise((resolve) => {
    conn.execute({
      sqlText: `SELECT username, password_hash FROM account WHERE username = ?`,
      binds: [username],
      complete: async (err, stmt, rows) => {
        if (err || rows.length === 0) {
          resolve(
            NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
          );
          return;
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!isMatch) {
          resolve(
            NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
          );
          return;
        }

        const token = jwt.sign(
          { id: user.ID, username: user.USERNAME },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        // ✅ Redirect instead of JSON
        const res = NextResponse.redirect(new URL("/", req.url));
        res.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        resolve(res);
      },
    });
  });
}
