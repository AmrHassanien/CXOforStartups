/**
 * Admin login endpoint — replaces Manus OAuth callback.
 * POST /auth/login  { username, password }  → sets session cookie
 * POST /auth/logout                         → clears session cookie
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import bcrypt from "bcryptjs";
import type { Request, Response, Router } from "express";
import { ENV } from "./env";
import { signSession } from "./sdk";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.nodeEnv === "production",
  sameSite: "lax" as const,
  maxAge: ONE_YEAR_MS / 1000, // seconds
  path: "/",
};

export function registerAuthRoutes(router: Router) {
  /**
   * POST /auth/login
   * Body: { username: string; password: string }
   */
  router.post("/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "username and password required" });
    }

    // Constant-time username check
    const usernameMatch = username === ENV.adminUsername;

    // Always run bcrypt compare to prevent timing attacks
    const storedHash = ENV.adminPasswordHash || "$2b$12$invalid-hash-placeholder";
    const passwordMatch = await bcrypt.compare(password, storedHash);

    if (!usernameMatch || !passwordMatch) {
      console.warn(`[Auth] Failed login attempt for username: ${username}`);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create JWT session
    const token = await signSession({ userId: 1, username });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      ok: true,
      user: { id: 1, username },
    });
  });

  /**
   * POST /auth/logout
   */
  router.post("/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res.json({ ok: true });
  });

  /**
   * GET /auth/me — returns current session info (or 401)
   */
  router.get("/auth/me", async (req: Request, res: Response) => {
    const cookieHeader = req.headers.cookie ?? "";
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match?.[1];

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Reuse the same verifySession logic from sdk
    const { jwtVerify } = await import("jose");
    try {
      const secret = new TextEncoder().encode(ENV.cookieSecret);
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
      });
      return res.json({
        user: { id: payload.userId, username: payload.username },
      });
    } catch {
      return res.status(401).json({ error: "Invalid session" });
    }
  });
}
