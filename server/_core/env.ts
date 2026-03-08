import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const ENV = {
  /** JWT signing secret for session cookies */
  cookieSecret: process.env.COOKIE_SECRET ?? "change-me-in-production",

  /** Admin username for dashboard login */
  adminUsername: process.env.ADMIN_USERNAME ?? "admin",

  /** Bcrypt-hashed admin password (generate with bcrypt.hashSync(password, 12)) */
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",

  /** Supabase PostgreSQL connection string */
  databaseUrl: process.env.DATABASE_URL ?? "",

  /** Firebase Storage bucket name (e.g. your-project.appspot.com) */
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",

  /** Google Gemini API key */
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",

  /** Node environment */
  nodeEnv: process.env.NODE_ENV ?? "development",
};
