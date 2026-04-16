import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    
    const { userId, product } = await req.json();

    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);

    let items = [];

    if (snap.exists()) {
      items = snap.data().items || [];
    }

    
    const existingIndex = items.findIndex(
      (item: any) => item.productId === product.id
    );

    if (existingIndex !== -1) {
      items[existingIndex].quantity += 1;
    } else {
        items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    await setDoc(cartRef, { items });

    return Response.json({ success: true, items });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const snap = await getDoc(doc(db, "carts", userId!));

  if (!snap.exists()) return Response.json([]);

  return Response.json(snap.data().items);
}

export async function PATCH(req: Request) {
  const { userId, productId, type } = await req.json();

  const cartRef = doc(db, "carts", userId);
  const snap = await getDoc(cartRef);

  if (!snap.exists()) return NextResponse.json({ success: false });

  let items = snap.data().items;

  items = items.map((item: any) => {
    if (item.productId === productId) {
      if (type === "inc") item.quantity += 1;
      if (type === "dec") item.quantity -= 1;

      
      if (item.quantity < 1) item.quantity = 1;
    }
    return item;
  });

  await setDoc(cartRef, { items });

  return NextResponse.json({ success: true, items });
}

