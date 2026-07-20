// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB, document, objectId } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET() {
	if ((await getSession())?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const rows = await (await connectDB()).collection("Category").find({}).sort({ name: 1 }).toArray();
	return NextResponse.json(rows.map(document));
}

export async function POST(request: Request) {
	const user = await getSession(); if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const { name } = await request.json(); if (!name || !String(name).trim()) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
	const db = await connectDB();
	const now = new Date();
	const result = await db.collection("Category").insertOne({ name: String(name).trim(), createdAt: now, updatedAt: now });
	const row = await db.collection("Category").findOne({ _id: result.insertedId });
	return NextResponse.json(document(row), { status: 201 });
}

export async function PUT(request: Request) {
	const user = await getSession(); if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
	const { id, name } = await request.json(); if (!id) return NextResponse.json({ error: "Category id is required." }, { status: 400 }); if (!name || !String(name).trim()) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
	try {
		const db = await connectDB();
		await db.collection("Category").updateOne({ _id: objectId(id) }, { $set: { name: String(name).trim(), updatedAt: new Date() } });
		const row = await db.collection("Category").findOne({ _id: objectId(id) });
		return NextResponse.json(document(row));
	} catch (error) {
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
	} catch (error) {
		return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
	}
}
