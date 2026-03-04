import { Router } from "express";
import { uploadFile } from "./storage";
import { nanoid } from "nanoid";

const router = Router();

// Middleware to parse multipart/form-data (file uploads)
router.post("/upload-image", async (req, res) => {
  try {
    // Get the file from the request
    // Note: This requires multer or similar middleware to handle multipart/form-data
    // For now, we'll use a simple approach with raw body parsing

    const contentType = req.headers["content-type"] || "";

    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    // Parse the multipart form data manually (simplified version)
    // In production, use multer or busboy
    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).json({ error: "Invalid multipart boundary" });
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));

    await new Promise((resolve) => req.on("end", resolve));

    const buffer = Buffer.concat(chunks);
    const parts = buffer.toString("binary").split(`--${boundary}`);

    // Find the file part
    let fileBuffer: Buffer | null = null;
    let fileName = "";
    let mimeType = "";

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="file"')) {
        const headerEnd = part.indexOf("\r\n\r\n");
        if (headerEnd === -1) continue;

        const headers = part.substring(0, headerEnd);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);

        if (filenameMatch) fileName = filenameMatch[1];
        if (contentTypeMatch) mimeType = contentTypeMatch[1];

        const fileData = part.substring(headerEnd + 4);
        const fileEnd = fileData.lastIndexOf("\r\n");
        fileBuffer = Buffer.from(fileData.substring(0, fileEnd), "binary");
        break;
      }
    }

    if (!fileBuffer || !fileName) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file size (5MB max)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File size must be less than 5MB" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({ error: "Invalid file type. Only images are allowed." });
    }

    // Upload to Firebase Storage
    const publicUrl = await uploadFile(fileBuffer, fileName, mimeType);

    return res.json({ url: publicUrl, fileName });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
