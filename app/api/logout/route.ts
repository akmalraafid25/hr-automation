import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.redirect(new URL("/login", "http://localhost:3000"))

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
