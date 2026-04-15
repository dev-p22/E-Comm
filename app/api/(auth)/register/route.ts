import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      fullName,
      role: "user",
      createdAt: new Date(),
    });

    return Response.json({
      uid: user.uid,
      email,
      fullName,
      role: "user",
      success: true,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
