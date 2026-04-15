import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
 { params }: { params: Promise<{ id: string }> }
) {

  const {id} = await params;
  const authHeader = req.headers.get("authorization");
  
      if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }   

  const data = await req.json();

  await updateDoc(doc(db, "products", id), data);

  return Response.json({ success: true });
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }

) {

  const {id} = await params;
  const authHeader = req.headers.get("authorization");
  
      if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }   

  await deleteDoc(doc(db, "products", id));

  return Response.json({ success: true });
}
