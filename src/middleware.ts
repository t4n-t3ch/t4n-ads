import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = path.startsWith('/generate') || path.startsWith('/gallery')

  const response = NextResponse.next()

  if (isProtectedRoute) {
    const supabase = createMiddlewareClient({ req: request, res: response })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/generate/:path*', '/gallery/:path*']
}
