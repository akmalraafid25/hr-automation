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
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    // Decode JWT using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    const userRole = payload.role as string
    
    // ADMIN-only routes
    const adminRoutes = ["/dashboard", "/application", "/job-post", "/account"]
    // USER-only routes  
    const userRoutes = ["/jobs", "/my-applications", "/profile"]
    
    if (adminRoutes.some(route => pathname.startsWith(route)) && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL("/jobs", req.url))
    }
    
    if (userRoutes.some(route => pathname.startsWith(route)) && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    // Redirect root based on role
    if (pathname === "/") {
      const redirectUrl = userRole === 'ADMIN' ? "/dashboard" : "/jobs"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
    
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

// Apply middleware to all routes except static, _next, favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
