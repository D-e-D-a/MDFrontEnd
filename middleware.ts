import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check if the user is authenticated with a token
export function middleware(req: NextRequest) {
  const cookies = req.headers.get('Cookie') || ''; // Get the cookie header from the request
  const token = cookies.split('; ').find((row) => row.startsWith('token=')); // Find the "token" cookie
  const isAdmin = cookies.split('; ').find((row) => row.startsWith('isAdmin=')); // Find the "isAdmin" cookie

  if (token) {
    // If the "token" cookie exists
    if (req.url.includes('/admin') && isAdmin !== 'isAdmin=true') {
      // If the user is trying to access an admin page but is not an admin
      return NextResponse.redirect(new URL('/home', req.url)); // Redirect to the home page
    }
    return NextResponse.next(); // Continue to the next middleware or route handler
  } else {
    // If the user is not authenticated with a token
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to the login page
  }
}

// Configuration for the middleware
export const config = {
  matcher: ['/home/:path*', '/admin/:path*', '/results/:path*'], // Protect all routes under /admin
};
