// app/(dashboard)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ROLE_ACCESS, UserRole } from "@/lib/rbac";

import Sidebar from "@/components/layout/sidebar";
import TopNavbar from "@/components/layout/top-navbar";

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
  // RBAC Validation
  // ------------------------------------

  if (!ROLE_ACCESS[user.role]) {
    redirect("/403");
  }

  // ------------------------------------
  // Layout
  // ------------------------------------

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}

      <aside className="hidden lg:flex w-[280px] shrink-0 border-r border-slate-200 bg-white">
        <Sidebar user={user} />
      </aside>

      {/* Mobile Sidebar */}
      {/* Drawer will be added later */}

      <div className="flex flex-1 flex-col min-w-0">

        {/* Top Navigation */}

        <TopNavbar user={user} />

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-[1800px] p-6 lg:p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}