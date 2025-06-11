import { NextResponse } from 'next/server'

export function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add cache control headers to prevent caching
  requestHeaders.set('Cache-Control', 'no-store, max-age=0')
  requestHeaders.set('Pragma', 'no-cache')
  
  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  // Apply the middleware to API routes and product edit routes
  matcher: ['/api/:path*', '/admin/products/:path*/edit'],
}