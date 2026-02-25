import { getServerSession } from "next-auth";
import { authOptions } from "./config";

/**
 * Server-side session utilities
 */

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  return session;
}

export async function getAuthToken() {
  const session = await getSession();
  
  if (!session?.user?.apiToken) {
    throw new Error("No auth token available");
  }
  
  return session.user.apiToken;
}
