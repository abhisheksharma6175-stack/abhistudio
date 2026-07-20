import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    // Try a few basic diagnostics
    let collections: string[] = [];
    try {
      // listCollections exists on a real MongoDB Db; memory fallback may not implement it
      // @ts-ignore
      const list = await db.listCollections().toArray();
      collections = list.map((c: any) => c.name || String(c));
    } catch (e) {
      // ignore -- memory DB will likely throw
      collections = ["(unable to list collections - possibly in-memory fallback)"];
    }

    return NextResponse.json({ ok: true, collections });
  } catch (error) {
    console.error("/api/debug/db ERROR:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
