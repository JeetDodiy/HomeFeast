import crypto from "crypto";

// AES-256-GCM requires a 32-byte key (256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.scryptSync(process.env.APP_SECRET || "homefeast-default-secret-salt-2026", "homefeast-salt", 32);

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128-bit initialization vector

/**
 * Encrypt sensitive fields (phone, address, ID documents, etc.)
 * Returns a hex string in the format: iv:authTag:encryptedData
 */
export function encryptSensitiveField(plaintext: string): string {
  if (!plaintext) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt sensitive field encrypted with encryptSensitiveField
 */
export function decryptSensitiveField(ciphertext: string): string {
  if (!ciphertext) return "";
  try {
    const parts = ciphertext.split(":");
    if (parts.length !== 3) {
      // If not encrypted format, return as-is
      return ciphertext;
    }
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("AES-256-GCM Decryption failed:", error);
    return "[Decryption Error]";
  }
}
