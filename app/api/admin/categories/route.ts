// @ts-nocheck
import { NextResponse } from "next/server"; import { connectDB, document } from "@/lib/mongodb"; import { getSession } from "@/lib/auth";
export async function GET() { if ((await getSession())?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 }); const rows = await (await connectDB()).collection("Category").find({}).sort({ name: 1 }).toArray(); return NextResponse.json(rows.map(document)); }
