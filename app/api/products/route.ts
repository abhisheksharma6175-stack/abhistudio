// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";

const mockProducts = [
  {
    id: "prod1",
    name: "Premium Argan Oil Shampoo",
    description: "Hydrating and restoring shampoo enriched with pure Moroccan argan oil. Restores dry, damaged hair by locking in natural moisture.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
    categoryId: "cat1",
    category: { name: "Hair Care", slug: "hair-care" },
  },
  {
    id: "prod2",
    name: "Keratin Nourishing Repair Conditioner",
    description: "Deeply conditions and strengthens hair strands, repairing damage caused by styling heat and color treatments.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    categoryId: "cat1",
    category: { name: "Hair Care", slug: "hair-care" },
  },
  {
    id: "prod3",
    name: "Hydrating Hyaluronic Face Serum",
    description: "Moisture-boosting facial serum with 2% hyaluronic acid and Vitamin B5. Restores plumpness and glow for a youthful complexion.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    categoryId: "cat2",
    category: { name: "Skin Care", slug: "skin-care" },
  },
  {
    id: "prod4",
    name: "Gentle Foaming Cleanser",
    description: "pH-balanced foaming facial cleanser that melts away makeup, excess oil, and impurities without stripping natural skin oils.",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    categoryId: "cat2",
    category: { name: "Skin Care", slug: "skin-care" },
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    // Try fetching from the MongoDB database
    const db = await connectDB();
    const categoryFilter = categorySlug ? await db.collection("Category").findOne({ slug: categorySlug }) : null;
    const rows = await db.collection("Product").find(categoryFilter ? { categoryId: categoryFilter._id } : {}).toArray();
    const categoryIds = rows.map((row) => row.categoryId).filter(Boolean);
    const categories = await db.collection("Category").find({ _id: { $in: categoryIds } }).toArray();
    const products = rows.map((row) => ({ ...document(row), category: document(categories.find((category) => String(category._id) === String(row.categoryId)) || { _id: "", name: "Product", slug: "product" }) }));

    // If database connection works but is empty, fallback to mock data
    if (products.length === 0) {
      if (categorySlug) return NextResponse.json(mockProducts.filter(p => p.category.slug === categorySlug));
      return NextResponse.json(mockProducts);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Database connection error in Products API, falling back to mock data:", error);
    
    // In case of error (database not initialized, network down), return fallback mock data
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      return NextResponse.json(mockProducts.filter(p => p.category.slug === categorySlug));
    }
    return NextResponse.json(mockProducts);
  }
}
