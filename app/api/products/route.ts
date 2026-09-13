// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";
import { ensureCatalogSeed } from "@/lib/catalogSeed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    const db = await connectDB();
    await ensureCatalogSeed();

    const categoryFilter = categorySlug ? await db.collection("Category").findOne({ slug: categorySlug }) : null;
    const rows = await db.collection("Product").find(categoryFilter ? { categoryId: categoryFilter._id } : {}).toArray();
    const categoryIds = rows.map((row) => row.categoryId).filter(Boolean);
    const categories = await db.collection("Category").find({ _id: { $in: categoryIds } }).toArray();
    const products = rows.map((row) => ({
      ...document(row),
      category: document(categories.find((category) => String(category._id) === String(row.categoryId)) || { _id: "", name: "Product", slug: "product" }),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API database error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to load products right now.",
    }, { status: 503 });
  }
}
