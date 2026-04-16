import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

async function generateJWT(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const user = userCred.user;

    const snap = await getDoc(doc(db, "users", user.uid));
    const userData = snap.data();

    // Generate JWT token
    const token = await generateJWT({
      uid: user.uid,
      email: user.email,
      role: userData?.role || "user",
      iat: Math.floor(Date.now() / 1000),
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 },
    );

    // Set HTTP-only, Secure, SameSite cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
 

    // Generic error message to prevent info leakage
    if (error.code === "auth/user-not-found") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (error.code === "auth/wrong-password") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
