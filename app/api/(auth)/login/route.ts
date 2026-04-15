import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if(!email || !password){
      return NextResponse.json({error:"Missing fields"},{status:400})
    }
    

    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCred.user;

    
    const snap = await getDoc(doc(db, "users", user.uid));
    const userData = snap.data();

    return Response.json({
      uid: user.uid,
      email,
      role: userData?.role || "user",
      fullName: userData?.fullName,
      success : true
    });
  } catch (error: any){
    return Response.json({ error: error.message }, { status: 500 });
  }
}