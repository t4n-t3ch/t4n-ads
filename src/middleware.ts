import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = path.startsWith('/generate') || path.startsWith('/gallery')
  
  if (isProtectedRoute) {
    // Simulate authentication check - replace with actual auth logic
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/generate/:path*', '/gallery/:path*']
}