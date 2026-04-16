import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {

      const { uid, role } = await req.json();

      console.log("received reques",uid,role)

    if (!uid || !role) {
      return NextResponse.json(
        { message: "UID and role required" },
        { status: 400 }
      );
    }

  
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({
      message: `Role '${role}' assigned successfully`,
    });
  } catch (error: any) {
  console.error("FULL ERROR:", error);

  return NextResponse.json(
    { message: error.message },
    { status: 500 }
  );
}
}