import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

const PUBLIC_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get("authToken")?.value;

  // 🔹 1. If logged-in user tries to access public routes → redirect home
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔹 2. If not logged-in and route is protected → redirect login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔹 3. If public route and no token → allow
  if (isPublic) {
    return NextResponse.next();
  }

  try {
    // 🔹 4. Verify token for protected routes
    const { payload } = await jwtVerify(token!, JWT_SECRET);

    // 🔹 5. Admin route protection
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 🔹 6. Attach user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.uid as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    // 🔹 7. Invalid token → clear cookie + redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    return response;
  }
}


export const config = { matcher: [ "/((?!_next/static|_next/image|favicon.ico|api/login|api/register|api/set-role).*)", ], }; 
