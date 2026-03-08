# Firebase App Hosting: Secret Management Guide

To securely deploy the CXO website, you must configure your sensitive variables (like API keys and database URLs) using the Google Cloud Secret Manager. Firebase App Hosting will then automatically inject these into your environment at runtime.

## 🛠️ Step 1: Create Secrets in GCP

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Search for **Secret Manager**.
3.  Create a new secret for each of the following:
    -   `DATABASE_URL` (From Supabase)
    -   `COOKIE_SECRET` (A long random string)
    -   `ADMIN_USERNAME` (Your desired admin username)
    -   `ADMIN_PASSWORD_HASH` (The bcrypt hash of your admin password)
    -   `GEMINI_API_KEY` (From Google AI Studio)
    -   `FIREBASE_STORAGE_BUCKET` (Your project's storage bucket URL)

## 🛠️ Step 2: Link Secrets to App Hosting

When you set up the **App Hosting Backend** in the Firebase Console:

1.  Navigate to the **App Hosting** tab in your Firebase project.
2.  Create a new Backend and link it to your GitHub repository.
3.  In the **Environment Variables** (or "Secrets") section of the setup, map your GCP secrets to the environment variables expected by the app:

| Environment Variable | Source Secret |
|----------------------|---------------|
| `DATABASE_URL` | `DATABASE_URL` |
| `COOKIE_SECRET` | `COOKIE_SECRET` |
| `ADMIN_USERNAME` | `ADMIN_USERNAME` |
| `ADMIN_PASSWORD_HASH` | `ADMIN_PASSWORD_HASH` |
| `GEMINI_API_KEY` | `GEMINI_API_KEY` |
| `FIREBASE_STORAGE_BUCKET` | `FIREBASE_STORAGE_BUCKET` |

## 🛠️ Step 3: Deployment

Once configured, any push to your main branch will trigger a build:

1.  **Build Phase**: Runs `pnpm build` (compiles Vite frontend and bundles Express server).
2.  **Run Phase**: Starts the server using `node dist/index.js`.
3.  **Authentication**: Your first login attempt will "bootstrap" the admin user into your Supabase database.

---

### 🛡️ Post-Migration Tip
Once you have successfully logged in for the first time, your admin user is stored in the Supabase `users` table. You can safely remove the `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` secrets/env vars if you wish, as the app will now prefer the database record.
