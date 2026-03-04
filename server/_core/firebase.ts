import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { ENV } from "./env";

/**
 * Initializes the Firebase Admin SDK.
 * 
 * Note: In a production environment, you should ideally use Application Default Credentials (ADC)
 * or a service account JSON key file. For simplicity in this migration, we assume
 * the environment is already authenticated via GCP/Firebase CLI or GOOGLE_APPLICATION_CREDENTIALS.
 */
export function initFirebaseAdmin(): App {
    const apps = getApps();

    if (apps.length > 0) {
        return apps[0]!;
    }

    // If GOOGLE_APPLICATION_CREDENTIALS is set, initializeApp() will use it automatically.
    // Otherwise, you might need to pass the service account explicitly.
    return initializeApp({
        storageBucket: ENV.firebaseStorageBucket,
    });
}
