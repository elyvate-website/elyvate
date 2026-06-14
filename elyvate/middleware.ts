import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/adminAuth'

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value
  const expected = process.env.ADMIN_SECRET

  if (!expected || cookie !== expected) {
    const loginUrl = new URL('/admin-login', req.url)
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
