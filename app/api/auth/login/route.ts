import { NextResponse } from "next/server";
import { connectDB, document } from "@/lib/mongodb";
import { createSessionToken, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await (await connectDB()).collection("User").findOne({ email: String(email).toLowerCase().trim() });
    if (!user || !(await verifyPassword(String(password), user.password))) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    const savedUser = document(user);
    const response = NextResponse.json({ user: { id: savedUser.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set(sessionCookie(createSessionToken({ id: savedUser.id, name: user.name ?? null, email: user.email, role: user.role })));
    return response;
  } catch { return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 }); }
}
