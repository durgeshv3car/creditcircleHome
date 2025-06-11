// lib/getToken.ts
import { auth } from "@/lib/auth";

export async function getToken(): Promise<string> {
  const session = await auth();
  if (session?.user && "token" in session.user) {
    return (session.user as { token: string }).token;
  }
  return "";
}
