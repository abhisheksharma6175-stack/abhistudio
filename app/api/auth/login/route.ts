import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";
import { createSessionToken, hashPassword, isConfiguredAdminCredential, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = String(email).toLowerCase().trim();
    const providedPassword = String(password);
    const db = await connectDB();
    let user = await db.collection("User").findOne({ email: normalizedEmail });
    const isAdminLogin = isConfiguredAdminCredential(normalizedEmail, providedPassword);

    if (!user && isAdminLogin) {
      const now = new Date();
      const created = await db.collection("User").insertOne({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: await hashPassword(providedPassword),
        role: "ADMIN",
        createdAt: now,
        updatedAt: now,
      });
      user = await db.collection("User").findOne({ _id: created.insertedId });
    }

    if (!user || !(await verifyPassword(providedPassword, user.password))) {
      if (isAdminLogin && user) {
        await db.collection("User").updateOne({ _id: user._id }, { $set: { role: "ADMIN", updatedAt: new Date() } });
        user = await db.collection("User").findOne({ _id: user._id });
      } else {
        return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const savedUser = document(user as Record<string, unknown>);
    const response = NextResponse.json({ user: { id: savedUser.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set(sessionCookie(createSessionToken({ id: savedUser.id, name: user.name ?? null, email: user.email, role: user.role })));
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
