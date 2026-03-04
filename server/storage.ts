/**
 * Firebase Storage integration — replaces the Manus storage proxy.
 *
 * Architecture:
 * - Uses the Firebase Admin SDK (firebase-admin) to generate signed upload URLs
 *   and to retrieve public download URLs.
 * - The bucket name is read from ENV.firebaseStorageBucket.
 * - Files are stored under a predictable path: uploads/<nanoid>-<filename>
 *
 * Usage pattern (same interface as the old Manus storagePut/storageGet):
 *   import { uploadFile, getFileUrl } from './storage';
 */

import { getStorage } from "firebase-admin/storage";
import { nanoid } from "nanoid";
import { ENV } from "./_core/env";
import { initFirebaseAdmin } from "./_core/firebase";

// Ensure Firebase Admin is initialized before using storage
initFirebaseAdmin();

/**
 * Upload a file buffer to Firebase Storage.
 * Returns the public HTTPS URL of the uploaded file.
 *
 * @param fileBuffer  Raw file content as Buffer
 * @param filename    Original filename (used for Content-Type detection)
 * @param mimeType    MIME type of the file
 */
export async function uploadFile(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const bucket = getStorage().bucket(ENV.firebaseStorageBucket);
  const storagePath = `uploads/${nanoid()}-${filename}`;

  const file = bucket.file(storagePath);
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
  });

  // Make the file publicly readable
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${ENV.firebaseStorageBucket}/${storagePath}`;
  return publicUrl;
}

/**
 * Get the public URL for a file already in Firebase Storage.
 * For files uploaded with makePublic() this is deterministic.
 *
 * @param storagePath  The path within the bucket (e.g. uploads/abc123-image.png)
 */
export function getFileUrl(storagePath: string): string {
  return `https://storage.googleapis.com/${ENV.firebaseStorageBucket}/${storagePath}`;
}

/**
 * Delete a file from Firebase Storage.
 *
 * @param storagePath  The path within the bucket
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const bucket = getStorage().bucket(ENV.firebaseStorageBucket);
  await bucket.file(storagePath).delete({ ignoreNotFound: true });
}
