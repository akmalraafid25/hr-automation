/*import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk"; // Importing directly as requested
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  let connection: snowflake.Connection; // Define connection here

  try {
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      return new NextResponse("Missing username or password", { status: 400 });
    }

    // 1. Create and establish Snowflake connection
    connection = snowflake.createConnection({
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
          console.error("Unable to connect to Snowflake:", err.message);
          reject(err);
        } else {
          console.log("Successfully connected to Snowflake.");
          resolve();
        }
      });
    });
    
    // 2. Find the user (using UPPER to be case-insensitive)
    const userQuery = `SELECT * FROM account WHERE UPPER(USERNAME) = UPPER(?);`;
    const [rows] = (await new Promise<[any[]]>((resolve, reject) => {
      connection.execute({
        sqlText: userQuery,
        binds: [username],
        complete: (err, stmt, rows) => {
          if (err || !rows) {
            reject(err);
          } else {
            resolve([rows]);
          }
        },
      });
    }));

    if (rows.length === 0) {
      console.log(`Login Failed: User not found.`);
      return new NextResponse("Unauthorized: Invalid credentials", { status: 401 });
    }

    const user = rows[0] as any;

    // 3. Compare the password hash
    const passwordMatch = await bcryptjs.compare(password, user.PASSWORD_HASH);

    if (!passwordMatch) {
      console.log(`Login Failed: Password does not match.`);
      return new NextResponse("Unauthorized: Invalid credentials", { status: 401 });
    }

    console.log(`Login Success: Password matches.`);

    // 4. Create a JWT with the user's data
    const token = jwt.sign(
      { 
        id: user.ID, 
        username: user.USERNAME,
        email: user.EMAIL 
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" }
    );

    // 5. Send the redirect response with the token in a cookie
    const res = NextResponse.redirect(new URL("/", req.url), 303);
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;

  } catch (error: any) {
    console.error("Login API Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    // 6. Always destroy the connection
    if (connection!) {
      await new Promise<void>((resolve) => {
        connection.destroy((err) => {
          if (err) {
            console.error("Failed to destroy connection:", err);
          }
          resolve();
        });
      });
    }
  }
}*/