import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { requireAuth, apiError, apiSuccess } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { product } = await req.json();

    if (!product || !product.id) {
      return apiError("Invalid product data", 400);
    }

    const cartRef = doc(db, "carts", user.uid);
    const snap = await getDoc(cartRef);

    let items = [];

    if (snap.exists()) {
      items = snap.data().items || [];
    }

    const existingIndex = items.findIndex(
      (item: any) => item.productId === product.id,
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

    return apiSuccess({ success: true, items });
  } catch (err: any) {
    console.error("Cart error:", err);
    return apiError("Failed to update cart", 500);
  }
}

export async function GET(req: Request) {
  try {
    // ✅ Require authentication
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    // ✅ Use user.uid from middleware
    const snap = await getDoc(doc(db, "carts", user.uid));

    if (!snap.exists()) {
      return apiSuccess({ items: [] });
    }

    return apiSuccess({ items: snap.data().items || [] });
  } catch (err: any) {
    console.error("Get cart error:", err);
    return apiError("Failed to fetch cart", 500);
  }
}

export async function PATCH(req: Request) {
  try {
    // ✅ Require authentication
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { productId, type } = await req.json();

    if (!productId || !type) {
      return apiError("Missing productId or type", 400);
    }

    // ✅ Use user.uid from middleware
    const cartRef = doc(db, "carts", user.uid);
    const snap = await getDoc(cartRef);

    if (!snap.exists()) {
      return apiError("Cart not found", 404);
    }

    let items = snap.data().items;

    items = items.map((item: any) => {
      if (item.productId === productId) {
        if (type === "inc") item.quantity += 1;
        if (type === "dec") item.quantity -= 1;

        // Prevent quantity from going below 1
        if (item.quantity < 1) item.quantity = 1;
      }
      return item;
    });

    await setDoc(cartRef, { items });

    return apiSuccess({ success: true, items });
  } catch (err: any) {
    console.error("PATCH cart error:", err);
    return apiError("Failed to update cart", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    // ✅ Require authentication
    const user = await requireAuth();
    if (!user) return apiError("Unauthorized", 401);

    const { productId } = await req.json();

    if (!productId) {
      return apiError("Missing productId", 400);
    }

    // ✅ Use user.uid from middleware
    const cartRef = doc(db, "carts", user.uid);
    const snap = await getDoc(cartRef);

    if (!snap.exists()) {
      return apiError("Cart not found", 404);
    }

    let items = snap.data().items;

    // Remove the product from cart
    items = items.filter((item: any) => item.productId !== productId);

    await setDoc(cartRef, { items });

    return apiSuccess({ success: true, items });
  } catch (err: any) {
    console.error("DELETE cart error:", err);
    return apiError("Failed to remove from cart", 500);
  }
}
