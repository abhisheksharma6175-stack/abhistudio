import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";
import { createSessionToken, hashPassword, isConfiguredAdminCredential, resolveUserRole, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name?.trim() || !email?.trim() || typeof password !== "string" || password.length < 8) return NextResponse.json({ error: "Enter your name, a valid email, and a password of at least 8 characters." }, { status: 400 });
    const normalizedEmail = email.toLowerCase().trim();
    const role = isConfiguredAdminCredential(normalizedEmail, password) ? "ADMIN" : resolveUserRole(normalizedEmail, "CUSTOMER");
    const db = await connectDB();
    if (await db.collection("User").findOne({ email: normalizedEmail })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const now = new Date(); const user = { name: name.trim(), email: normalizedEmail, password: await hashPassword(password), role, createdAt: now, updatedAt: now };
    const result = await db.collection("User").insertOne(user);
    const savedUser = document({ ...user, _id: result.insertedId });
    const response = NextResponse.json({ user: { id: savedUser.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    response.cookies.set(sessionCookie(createSessionToken({ id: savedUser.id, name: user.name, email: user.email, role })));
    return response;
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}
