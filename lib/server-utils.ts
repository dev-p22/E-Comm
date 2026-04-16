/**
 * ⚠️ SERVER-ONLY UTILITIES
 * This file contains functions that use server-only APIs (next/headers)
 * This should ONLY be imported in server components and API routes
 * DO NOT import this in client components ("use client")
 */

import { headers } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

/**
 * Get authenticated user from request headers (set by middleware)
 * Used in API routes and server actions to access current user info
 * ⚠️ SERVER-ONLY - Do not use in client components
 */
export async function getAuthenticatedUser() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const userRole = headersList.get("x-user-role");

  if (!userId) {
    return null;
  }

  return {
    uid: userId,
    role: userRole,
  };
}

/**
 * Verify JWT token from cookies
 * Use in server actions or API routes that need to verify auth
 * ⚠️ SERVER-ONLY - Do not use in client components
 */
export async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * CSRF Token generator - add CSRF protection to forms
 * Store token in session and verify on submission
 * ⚠️ SERVER-ONLY - Do not use in client components
 */
export function generateCSRFToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
