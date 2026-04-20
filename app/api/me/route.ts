import { getAuthenticatedUser } from "@/lib/server-utils";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";


/**
 * GET /api/me
 * Returns current authenticated user's information
 * Used to populate user state in Redux after login
 */
export async function GET(req: any) {
  try {
    // Get user from middleware headers
    const user = await getAuthenticatedUser();

    if (!user) {
      return apiError("Unauthorized", 401);
    }

    // Fetch additional user data from Firestore
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return apiError("User not found", 404);
    }

    const userData = snap.data();

    // Return only safe user info
    return apiSuccess({
      uid: user.uid,
      email: userData.email,
      fullName: userData.fullName,
      role: user.role || userData.role || "user",
      success : true,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    return apiError("Failed to fetch user", 500);
  }
}
