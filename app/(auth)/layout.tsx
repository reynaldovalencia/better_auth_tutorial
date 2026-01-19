import { getServerSession } from "@/lib/get-session";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  //Si ya esta logueado, redirigir al dashboard
  if (user) redirect("/dashboard");

  return children;
}
