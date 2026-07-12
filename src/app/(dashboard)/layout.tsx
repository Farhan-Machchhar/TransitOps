import { NavSidebar } from "@/components/shared/nav-sidebar";
import { TopBar } from "@/components/shared/top-bar";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ROLE_ACCESS, UserRole } from "@/lib/rbac";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // ------------------------------------
  // Authentication
  // ------------------------------------

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ------------------------------------
  // User Information
  // ------------------------------------

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as UserRole,
    image: session.user.image,
  };
  // ------------------------------------
  // Layout
  // ------------------------------------

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <NavSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}