import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl
 
  const isPublicPath = pathname === '/login' || pathname === '/register';

  // If user has no token AND is not on the login or register page
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl);
  }
 
  // If user HAS a token and is trying to access login/register, send them to homepage
  if (token && isPublicPath) {
    const homeUrl = new URL('/', req.url)
    return NextResponse.redirect(homeUrl);
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. API routes (paths starting with /api/)
     * 2. Static files (_next/static)
     * 3. Image optimization files (_next/image)
     * 4. Favicon (favicon.ico)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
}