import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {  

  const { userId } = await req.json();

   const { id } = await params;

  const cartRef = doc(db, "carts", userId);
  const snap = await getDoc(cartRef);

  if (!snap.exists()) return Response.json([]);

  let items = snap.data().items;

  items = items.filter((item: any) => item.productId !== id);

  await setDoc(cartRef, { items });

  return Response.json({success:true,items});
}