import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

type Session = { name: string; expiresAt: number };

function getCredentials() {
  const name = process.env.MY_ADMIN_NAME;
  const password = process.env.MY_ADMIN_PASSWORD;
  if (!name || !password) throw new Error("MY_ADMIN_NAME et MY_ADMIN_PASSWORD doivent être définis.");
  return { name, password };
}

function sign(value: string) {
  const { name, password } = getCredentials();
  return createHmac("sha256", `${name}:${password}`).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateCredentials(name: string, password: string) {
  const admin = getCredentials();
  return safeEqual(name, admin.name) && safeEqual(password, admin.password);
}

export async function createSession() {
  const { name } = getCredentials();
  const payload = Buffer.from(JSON.stringify({ name, expiresAt: Date.now() + SESSION_DURATION_MS } satisfies Session)).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_DURATION_MS / 1000 });
}

export async function deleteSession() { (await cookies()).delete(SESSION_COOKIE); }

export async function isAdmin() {
  try {
    const value = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!value) return false;
    const [payload, signature, ...rest] = value.split(".");
    if (!payload || !signature || rest.length || !safeEqual(signature, sign(payload))) return false;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    return session.expiresAt > Date.now() && safeEqual(session.name, getCredentials().name);
  } catch { return false; }
}

export async function requireAdmin() { if (!(await isAdmin())) redirect("/connexion"); }

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  return Boolean(origin && host && origin === `${protocol}://${host}`);
}
