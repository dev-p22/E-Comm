import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }   

    const data = await req.json();

    if(!data.title || !data.price || !data.description || !data.category){
        return NextResponse.json({error:"Missing fields"},{status:400})
    }

    const defaultImage =
      "https://via.placeholder.com/300?text=Product";

    const docRef = await addDoc(collection(db, "products"), {
      title: data.title,
      price: data.price,
      description: data.description,
      category: data.category,
      image: data.image || defaultImage,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, success : true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const snapshot = await getDocs(collection(db, "products"));

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    success : true,
    ...doc.data(),
  }));

  return Response.json(products);
}