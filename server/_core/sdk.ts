import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

export type SessionPayload = {
  /** Admin user ID in our DB */
  userId: number;
  /** Username for display */
  username: string;
};

// ---------------------------------------------------------------------------
// JWT session helpers
// ---------------------------------------------------------------------------
const getSessionSecret = () => new TextEncoder().encode(ENV.cookieSecret);

export async function signSession(payload: SessionPayload): Promise<string> {
  const issuedAt = Date.now();
  const expiresInMs = ONE_YEAR_MS;
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);

  return new SignJWT({ userId: payload.userId, username: payload.username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSessionSecret());
}

async function verifySession(
  cookieValue: string | undefined | null
): Promise<SessionPayload | null> {
  if (!cookieValue) {
    console.warn("[Auth] Missing session cookie");
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const { userId, username } = payload as Record<string, unknown>;

    if (typeof userId !== "number" || !isNonEmptyString(username)) {
      console.warn("[Auth] Session payload missing required fields");
      return null;
    }

    return { userId, username };
  } catch (error) {
    console.warn("[Auth] Session verification failed", String(error));
    return null;
  }
}

// ---------------------------------------------------------------------------
// Request authentication
// ---------------------------------------------------------------------------
function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) return new Map();
  return new Map(Object.entries(parseCookieHeader(cookieHeader)));
}

export async function authenticateRequest(req: Request): Promise<User> {
  const cookies = parseCookies(req.headers.cookie);
  const sessionCookie = cookies.get(COOKIE_NAME);
  const session = await verifySession(sessionCookie);

  if (!session) {
    throw ForbiddenError("Invalid or missing session");
  }

  const user = await db.getUserById(session.userId);
  if (!user) {
    throw ForbiddenError("User not found");
  }

  return user;
}

// ---------------------------------------------------------------------------
// Legacy sdk export — retained so existing callers compile without changes.
// New code should import the named exports above instead.
// ---------------------------------------------------------------------------
export const sdk = {
  authenticateRequest,
  signSession,
  verifySession,
  /** @deprecated — no-op, kept for compatibility */
  createSessionToken: (_openId: string, _opts?: object) =>
    Promise.resolve(""),
};
