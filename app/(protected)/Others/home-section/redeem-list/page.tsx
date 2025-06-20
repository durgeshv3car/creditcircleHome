import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Redeem"; 

export default async function MainPage() {
  const allowed = await checkRoute("RedeemList");
  if (!allowed) notFound();

  return <Users />;
}
