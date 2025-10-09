import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url))

  // Clear the cookie
  res.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // expire immediately
  })

  return res
}
