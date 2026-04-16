import { requireAdmin } from "@/lib/api-utils";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
   const user = await requireAdmin();
  
      if(!user){
        return NextResponse.json({error:"Unauthorized"},{status:401})
      }    
  
  const { id } = await params;
  const data = await req.json();

  await updateDoc(doc(db, "products", id), data);

  return Response.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  
  if(!user){
    return NextResponse.json({error:"Unauthorized"},{status:401})
  }    
  
  const { id } = await params;

  await deleteDoc(doc(db, "products", id));

  return Response.json({ success: true });
}
