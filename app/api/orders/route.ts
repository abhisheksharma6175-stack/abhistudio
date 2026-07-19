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
  try { const { items, shippingAddress } = await request.json(); if (!Array.isArray(items) || !items.length || !shippingAddress?.trim()) throw new Error("Cart items and a shipping address are required."); const db = await connectDB(); const ids = items.map((item: { id: string }) => objectId(item.id)); const products = await db.collection("Product").find({ _id: { $in: ids } }).toArray(); if (products.length !== items.length) throw new Error("One or more products are unavailable."); const prepared = items.map((item: { id: string; quantity: number }) => { const product = products.find((entry) => String(entry._id) === item.id)!; const quantity = Math.max(1, Math.floor(Number(item.quantity))); if (product.stock < quantity) throw new Error(`${product.name} does not have enough stock.`); return { product, quantity }; }); for (const { product, quantity } of prepared) await db.collection("Product").updateOne({ _id: product._id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }); const order = { userId: objectId(user.id), status: "PENDING", paymentStatus: "PENDING", totalAmount: prepared.reduce((sum, item) => sum + item.product.price * item.quantity, 0), shippingAddress: shippingAddress.trim(), items: prepared.map(({ product, quantity }) => ({ productId: product._id, quantity, price: product.price })), createdAt: new Date(), updatedAt: new Date() }; const result = await db.collection("Order").insertOne(order); return NextResponse.json(document({ ...order, _id: result.insertedId }), { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to place order." }, { status: 400 }); }
}
