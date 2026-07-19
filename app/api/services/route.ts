// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";

const mockServices = [
  {
    id: "svc1",
    name: "Signature Precision Haircut",
    description: "A customized haircut experience including professional styling consultation, relaxing shampoo wash, precision trim, and blowout styling.",
    price: 45.00,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop",
    category: { name: "Hair Styling", slug: "hair-styling" },
  },
  {
    id: "svc2",
    name: "Balayage Artistry Hair Color",
    description: "Hand-painted premium highlights that blend seamlessly with your natural hair, creating a soft, sun-kissed, dimension-rich color look.",
    price: 145.00,
    duration: 120,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop",
    category: { name: "Hair Styling", slug: "hair-styling" },
  },
  {
    id: "svc3",
    name: "Oxygenating Hydrating Facial",
    description: "A luxurious deep-cleansing facial therapy utilizing custom fruit enzyme masks, deep pore extractions, soothing massage, and oxygen hydration.",
    price: 75.00,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop",
    category: { name: "Facial & Spa", slug: "facial-spa" },
  },
  {
    id: "svc4",
    name: "Nourishing Gel Manicure",
    description: "Detailed nail shaping, cuticle therapy, therapeutic hand massage, and long-lasting non-toxic gel polish set under UV light.",
    price: 35.00,
    duration: 40,
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop",
    category: { name: "Nail Care", slug: "nail-care" },
  },
];

export async function GET() {
  try {
    const db = await connectDB();
    const rows = await db.collection("Service").find({}).toArray();
    const categories = await db.collection("Category").find({ _id: { $in: rows.map((row) => row.categoryId).filter(Boolean) } }).toArray();
    const services = rows.map((row) => ({ ...document(row), category: document(categories.find((category) => String(category._id) === String(row.categoryId)) || { _id: "", name: "Service", slug: "service" }) }));

    if (services.length === 0) {
      return NextResponse.json(mockServices);
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Database connection error in Services API, falling back to mock data:", error);
    return NextResponse.json(mockServices);
  }
}
