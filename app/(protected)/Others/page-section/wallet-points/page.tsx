import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/wallet"; 

export default async function MainPage() {
  const allowed = await checkRoute("WalletPoints");
  if (!allowed) notFound();

  return <Users />;
}
