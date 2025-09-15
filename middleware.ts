import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/api/login", "/_next", "/favicon.ico"]
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = req.cookies.get("token")?.value
  if (!token) {
    console.log("🛑 No token found, redirecting to /login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    // Decode JWT using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    console.log("✅ Token is valid:", payload)
    return NextResponse.next()
  } catch (err) {
    console.error("❌ JWT verification failed:", err)
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

// Apply middleware to all routes except static, _next, favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
