import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const PROTECTED_ROUTES = ['/generate', '/gallery']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get the session token from cookies
  const sessionToken = request.cookies.get('session-token')?.value

  // If no session token exists, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // TODO: In a real implementation, validate the session token here
  // For now, we'll assume the token is valid if it exists
  // You would typically:
  // 1. Validate the token with your auth provider (Supabase, Auth0, etc.)
  // 2. Check token expiration
  // 3. Verify user exists in database

  // For demo purposes, we'll check if it's a valid JWT-like token
  const isValidToken = sessionToken.length > 20 // Simple length check for demo

  if (!isValidToken) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session-token')
    return response
  }

  // Token is valid, allow access to protected route
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}