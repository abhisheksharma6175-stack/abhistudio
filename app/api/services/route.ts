// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const rows = await db.collection("Service").find({}).toArray();
    const categories = await db.collection("Category").find({ _id: { $in: rows.map((row) => row.categoryId).filter(Boolean) } }).toArray();
    const services = rows.map((row) => ({
      ...document(row),
      category: document(categories.find((category) => String(category._id) === String(row.categoryId)) || { _id: "", name: "Service", slug: "service" }),
    }));

    return NextResponse.json(services);
  } catch (error) {
    console.error("Services API database error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to load services right now.",
    }, { status: 503 });
  }
}
