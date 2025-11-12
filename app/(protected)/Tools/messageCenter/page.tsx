import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";


export default async function MainPage() {
  const allowed = await checkRoute("messageCenter");
  if (!allowed) notFound();

  return <></>;
}
