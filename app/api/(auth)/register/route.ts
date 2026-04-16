import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
    const { email, password, fullName } = await req.json();

    // Validate all fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters with uppercase, lowercase, and numbers",
        },
        { status: 400 },
      );
    }

    // Validate full name length
    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters" },
        { status: 400 },
      );
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
      fullName: fullName.trim(),
      role: "user",
      createdAt: new Date(),
    });

    // Generate JWT token
    const token = await generateJWT({
      uid: user.uid,
      email: user.email,
      role: "user",
      iat: Math.floor(Date.now() / 1000),
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
      },
      { status: 201 },
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
    console.error("Register error:", error);

    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    if (error.code === "auth/weak-password") {
      return NextResponse.json(
        { error: "Password is too weak" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
