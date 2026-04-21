import { apiError, requireAuth } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST() {
  try {
      const user = await requireAuth();
       if (!user) return apiError("You can't Logout", 401);



    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 },
    );

   
    response.cookies.delete("authToken");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 },
    );
  }
}
