// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document, objectId } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession(); if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const db = await connectDB(); const rows = await db.collection("Order").find(user.role === "ADMIN" ? {} : { userId: objectId(user.id) }).sort({ createdAt: -1 }).toArray();
  const userIds = rows.map((row) => row.userId); const productIds = rows.flatMap((row) => (row.items || []).map((item: { productId: unknown }) => item.productId));
  const users = await db.collection("User").find({ _id: { $in: userIds } }).toArray(); const products = await db.collection("Product").find({ _id: { $in: productIds } }).toArray();
  return NextResponse.json(rows.map((row) => ({ ...document(row), user: (() => { const found = users.find((entry) => String(entry._id) === String(row.userId)); return found ? { name: found.name, email: found.email } : { name: null, email: "Unknown" }; })(), items: (row.items || []).map((item: { productId: unknown }) => ({ ...item, product: document(products.find((product) => String(product._id) === String(item.productId)) || { _id: "", name: "Deleted product" }) })) })));
}
export async function POST(request: Request) {
  const user = await getSession(); if (!user) return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  try {
    const { items, shippingAddress } = await request.json();
    if (!Array.isArray(items) || !items.length || !shippingAddress?.trim()) throw new Error("Cart items and a shipping address are required.");
    const db = await connectDB();
    // validate and convert incoming ids; report any invalid ids to the client
    const invalidIds: string[] = [];
    const ids: any[] = [];
    for (const item of items) {
      try {
        ids.push(objectId(item.id));
      } catch {
        invalidIds.push(item.id);
      }
    }
    if (invalidIds.length) {
      return NextResponse.json({ error: "Invalid product id(s)", invalidIds }, { status: 400 });
    }
    const products = await db.collection("Product").find({ _id: { $in: ids } }).toArray();

    // detect missing products
    const foundIds = products.map((p: any) => String(p._id));
    const missing = items.filter((it: any) => !foundIds.includes(String(it.id))).map((it: any) => it.id);
    if (missing.length) {
      return NextResponse.json({ error: "One or more products are unavailable.", missing }, { status: 409 });
    }

    // detect insufficient stock
    const insufficient: Array<{ id: string; name: string; requested: number; available: number }> = [];
    const prepared = items.map((item: { id: string; quantity: number }) => {
      const product = products.find((entry: any) => String(entry._id) === String(item.id));
      const quantity = Math.max(1, Math.floor(Number(item.quantity)));
      if (product.stock < quantity) {
        insufficient.push({ id: String(product._id), name: product.name, requested: quantity, available: product.stock });
      }
      return { product, quantity };
    });

    if (insufficient.length) {
      return NextResponse.json({ error: "Insufficient stock for some items.", insufficient }, { status: 409 });
    }

    for (const { product, quantity } of prepared) await db.collection("Product").updateOne({ _id: product._id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } });
    const order = { userId: objectId(user.id), status: "PENDING", paymentStatus: "PENDING", totalAmount: prepared.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0), shippingAddress: shippingAddress.trim(), items: prepared.map(({ product, quantity }: any) => ({ productId: product._id, quantity, price: product.price })), createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection("Order").insertOne(order);
    return NextResponse.json(document({ ...order, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to place order." }, { status: 400 });
  }
}
