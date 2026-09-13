import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { getServerConfig } from "@/lib/env";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = "abhi_session";
const { SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = getServerConfig();
const secret = SESSION_SECRET;

export type SessionUser = { id: string; name: string | null; email: string; role: "CUSTOMER" | "ADMIN" | "STYLIST" };

function normalizeEmail(value: string) {
  return value.toLowerCase().trim();
}

export function getConfiguredAdminEmail() {
  return normalizeEmail(ADMIN_EMAIL);
}

export function getConfiguredAdminPassword() {
  return ADMIN_PASSWORD;
}

export function isConfiguredAdminCredential(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  return normalizedEmail === getConfiguredAdminEmail() && password === getConfiguredAdminPassword();
}

export function resolveUserRole(email: string, fallback: SessionUser["role"] = "CUSTOMER") {
  const normalizedEmail = normalizeEmail(email);
  const configuredAdminEmail = getConfiguredAdminEmail();
  return configuredAdminEmail && normalizedEmail === configuredAdminEmail ? "ADMIN" : fallback;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string | undefined | null) {
  if (typeof password !== "string" || !password || typeof stored !== "string" || !stored.trim()) return false;

  // Seed data may contain bcrypt hashes; new accounts use Node's built-in scrypt format.
  const [salt, hash] = stored.split(":");
  if (!salt || !hash || !/^[a-fA-F0-9]+$/.test(hash)) return false;

  try {
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    const expected = Buffer.from(hash, "hex");
    if (expected.length !== derived.length) return false;
    return timingSafeEqual(expected, derived);
  } catch {
    return false;
  }
}

function sign(value: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== sign(payload)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionUser & { exp: number };
    if (decoded.exp < Date.now()) return null;
    return { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
  } catch { return null; }
}

export async function getSession() {
  const store = await cookies();
  return readSessionToken(store.get(COOKIE_NAME)?.value);
}

export function sessionCookie(token: string) {
  return { name: COOKIE_NAME, value: token, options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 } };
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: "", options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 0 } };
}
