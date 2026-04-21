import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc , increment, updateDoc, deleteField } from "firebase/firestore";
import { requireAuth, apiError, apiSuccess } from "@/lib/api-utils";



export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { product } = await req.json();
    if (!product?.id) return apiError("Invalid product", 400);

    const cartRef = doc(db, "carts", user.uid);

    // ensure doc exists
    await setDoc(cartRef, {}, { merge: true });

    await updateDoc(cartRef, {
      [`items.${product.id}.title`] : product.title,
      [`items.${product.id}.price`] : product.price,
      [`items.${product.id}.image`] : product.image,
      [`items.${product.id}.quantity`] : increment(1),
    });

    return apiSuccess({ success: true });
  } catch (err: any) {
    return apiError("Failed to update cart", 500);
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const snap = await getDoc(doc(db, "carts", user.uid));

    if (!snap.exists()) {
      return apiSuccess({ items: [] });
    }

    const itemsObj = snap.data().items || {};

    // convert to array for frontend
    const items = Object.entries(itemsObj).map(([id, data]: any) => ({
      productId: id,
      ...data,
    }));

    return apiSuccess({ items });
  } catch {
    return apiError("Failed to fetch cart", 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { productId, type } = await req.json();
    if (!productId || !type) {
      return apiError("Missing data", 400);
    }

    const cartRef = doc(db, "carts", user.uid);

    const delta = type === "inc" ? 1 : -1;

    await updateDoc(cartRef, {
      [`items.${productId}.quantity`]: increment(delta),
    });

    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to update cart", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { productId } = await req.json();
    if (!productId) {
      return apiError("Missing productId", 400);
    }

    const cartRef = doc(db, "carts", user.uid);

    await updateDoc(cartRef, {
      [`items.${productId}`]: deleteField(),
    });

    return apiSuccess({ success: true });
  } catch {
    return apiError("Failed to remove from cart", 500);
  }
}
