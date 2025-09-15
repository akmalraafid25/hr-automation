import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const formData = await req.formData()
  const username = formData.get("username")?.toString() || ""
  const password = formData.get("password")?.toString() || ""

  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "1h" })

    const res = NextResponse.redirect(new URL("/", req.url))
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return res
  }

  return new NextResponse("Unauthorized", { status: 401 })
}
