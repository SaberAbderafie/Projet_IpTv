import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let user = null;

  try {
    user = await getOrCreateCurrentUser();
  } catch {
    // pas connecté → on renvoie vers la page de login Clerk
    redirect("/sign-in");
  }

  if (!user || user.role !== "ADMIN") {
    // connecté mais pas admin → home ou page "Non autorisé"
    redirect("/");
    

  }

  return <>{children}</>;
}

