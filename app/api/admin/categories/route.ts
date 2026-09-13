// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document, objectId } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET() {
	if ((await getSession())?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const rows = await (await connectDB()).collection("Category").find({}).sort({ name: 1 }).toArray();
	return NextResponse.json(rows.map(document));
}

function slugify(value: string) {
	return String(value || "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "") || "item";
}

export async function POST(request: Request) {
	const user = await getSession(); if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const { name } = await request.json(); if (!name || !String(name).trim()) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
	const db = await connectDB();
	const now = new Date();
	const cleanedName = String(name).trim();
	const result = await db.collection("Category").insertOne({ name: cleanedName, slug: slugify(cleanedName), createdAt: now, updatedAt: now });
	const row = await db.collection("Category").findOne({ _id: result.insertedId });
	return NextResponse.json(document(row), { status: 201 });
}

export async function PUT(request: Request) {
	const user = await getSession(); if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const { id, name } = await request.json(); if (!id) return NextResponse.json({ error: "Category id is required." }, { status: 400 }); if (!name || !String(name).trim()) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
	try {
		const db = await connectDB();
		const cleanedName = String(name).trim();
		await db.collection("Category").updateOne({ _id: objectId(id) }, { $set: { name: cleanedName, slug: slugify(cleanedName), updatedAt: new Date() } });
		const row = await db.collection("Category").findOne({ _id: objectId(id) });
		return NextResponse.json(document(row));
	} catch {
		return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
	}
}

export async function DELETE(request: Request) {
	const user = await getSession(); if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (!id) return NextResponse.json({ error: "Category id is required." }, { status: 400 });
		const db = await connectDB();
		await db.collection("Category").deleteOne({ _id: objectId(id) });
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
	}
}
