import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/User-Logs"; 
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

export default async function MainPage() {
  const allowed = await checkRoute("User Logs");
  if (!allowed) notFound();

  interface DecodedToken {
    role: string;
    id?: string;
    permissions?: string[];
  }

  const session = await auth();
  let role = "";
  let id = "";
  let permissions: string[] = []; 

  if (session?.user && "token" in session.user) {
    const decoded = jwtDecode<DecodedToken>(
      (session.user as { token: string }).token
    );
    role = decoded.role;
    id = (session.user as any).id;
    permissions = (session.user as any).permissions || [];
  }

  return <Users adminId={id} permissions={permissions} role={role} />;
}