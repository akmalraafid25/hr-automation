import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || req.url
    const baseUrl = new URL(origin).origin
    const res = NextResponse.redirect(new URL("/login", baseUrl))

    res.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0
    })

    return res
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
