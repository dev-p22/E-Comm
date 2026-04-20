import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Secret key for JWT - store in .env.local
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// Public routes (no auth required)
const PUBLIC_ROUTES = ["/login", "/register"];

// Admin routes (admin role required)
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookies (secure, HTTP-only)
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check if admin route
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.uid as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token - redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    return response;
  }
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/login|api/register|api/set-role).*)",
  ],
};
