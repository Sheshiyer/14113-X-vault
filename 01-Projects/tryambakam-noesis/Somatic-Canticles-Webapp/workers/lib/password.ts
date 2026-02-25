import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id configuration as per .context/auth/security.md
 * - Memory cost: 64MB (65536 KiB)
 * - Time cost: 3 iterations
 * - Parallelism: 4 threads
 */
const ARGON2_CONFIG = {
  memoryCost: 65536, // 64 MB in KiB
  timeCost: 3,
  parallelism: 4,
};

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashed = await hash(password, {
      memoryCost: ARGON2_CONFIG.memoryCost,
      timeCost: ARGON2_CONFIG.timeCost,
      parallelism: ARGON2_CONFIG.parallelism,
      outputLen: 32,
    });
    
    return hashed;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  try {
    const isValid = await verify(hashedPassword, plainPassword, {
      memoryCost: ARGON2_CONFIG.memoryCost,
      timeCost: ARGON2_CONFIG.timeCost,
      parallelism: ARGON2_CONFIG.parallelism,
    });
    
    return isValid;
  } catch (error) {
    // Return false on verification error rather than throwing
    return false;
  }
}
