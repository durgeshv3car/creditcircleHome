import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Category"; 

export default async function MainPage() {
  const allowed = await checkRoute("Category");
  if (!allowed) notFound();

  return <Users />;
}
