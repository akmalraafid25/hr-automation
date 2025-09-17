import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import snowflake from "snowflake-sdk"
import crypto from "crypto"
import bcrypt from "bcryptjs"

function createConnection() {
  const privateKey = crypto.createPrivateKey({
    key: process.env.SNOWFLAKE_PRIVATE_KEY!,
    format: "pem",
    type: "pkcs8",
  })

  return snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    authenticator: "SNOWFLAKE_JWT",
    privateKey: process.env.SNOWFLAKE_PRIVATE_KEY,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
  })
}

function connectAsync(conn: snowflake.Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function executeAsync(conn: snowflake.Connection, sql: string, binds: any[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) reject(err)
        else resolve(rows)
      },
    })
  })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const username = formData.get("username")?.toString() || ""
  const password = formData.get("password")?.toString() || ""

  const conn = createConnection()

  try {
    await connectAsync(conn)

    const rows = await executeAsync(
      conn,
      `SELECT ID, NAME, USERNAME, PASSWORD_HASH, EMAIL, PHONE, ROLE
       FROM ACCOUNT_TEST
       WHERE USERNAME = ?`,
      [username]
    )

    if (rows.length === 0) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = rows[0]

    const isValid = await bcrypt.compare(password, user.PASSWORD_HASH)

    console.log("Password match result:", isValid)

    if (!isValid) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const token = jwt.sign(
      { id: user.ID, username: user.USERNAME, name: user.NAME, email: user.EMAIL, role: user.ROLE },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )

    // Redirect based on role
    const redirectUrl = user.ROLE === 'ADMIN' ? "/" : "/jobs"
    const res = NextResponse.redirect(new URL(redirectUrl, req.url))
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return res
  } catch (error) {
    console.error("Snowflake login error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  } finally {
    conn.destroy((err) => err && console.error("Disconnect error:", err))
  }
}
