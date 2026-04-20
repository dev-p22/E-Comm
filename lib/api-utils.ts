import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "./server-utils";

/**
 * API Response Utility
 * Handles consistent success and error responses
 */
export function apiSuccess(data: any, statusCode = 200) {
  return NextResponse.json(data, { status: statusCode });
}

export function apiError(message: string, statusCode = 400) {
  return NextResponse.json({ error: message }, { status: statusCode });
}

/**
 * Require Authentication Middleware
 * Use this to protect API routes that require authentication
 *
 * @example
 * export async function POST(req: Request) {
 *   const user = await requireAuth();
 *   if (!user) return apiError("Unauthorized", 401);
 *   // ... rest of handler
 * }
 */
export async function requireAuth() {
  return await getAuthenticatedUser();
}

/**
 * Require Admin Role
 * Use this to protect API routes that require admin access
 *
 * @example
 * export async function DELETE(req: Request) {
 *   const user = await requireAdmin();
 *   if (!user) return apiError("Forbidden", 403);
 *   // ... rest of handler
 * }
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (user?.role !== "admin") {
    return null;
  }
  return user;
}

/**
 * Validate Request Method
 * Prevents methods not explicitly allowed
 */
export function validateMethod(
  req: Request,
  allowedMethods: string[],
): boolean {
  return allowedMethods.includes(req.method);
}

/**
 * Validate Required Fields
 * Ensures all required fields are present in request body
 */
export function validateRequired(
  data: any,
  requiredFields: string[],
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(
    (field) => !data[field] || data[field].toString().trim() === "",
  );
  return {
    valid: missing.length === 0,
    missing,
  };  
}

/**
 * Rate Limiting Helper
 * Connect to Redis for production rate limiting
 * For now, use basic in-memory Map (not recommended for production)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000, // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Sanitize Error Messages
 * Don't leak sensitive information in error responses
 */
export function sanitizeError(error: any, isDevelopment = false): string {
  if (isDevelopment) {
    return error.message;
  }

  // Return generic message in production
  if (error.code === "auth/user-not-found") {
    return "Invalid credentials";
  }
  if (error.code === "auth/wrong-password") {
    return "Invalid credentials";
  }
  if (error.code === "auth/email-already-in-use") {
    return "Email already registered";
  }

  return "An error occurred. Please try again.";
}
