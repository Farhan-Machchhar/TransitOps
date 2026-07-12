"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { navigationItems } from "@/lib/navigation";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const items = navigationItems.filter((item) =>
    item.roles.includes(user.role as never)
  );

  return (
    <div className="flex h-screen w-full flex-col bg-white">

      {/* Logo */}

      <div className="border-b border-slate-200 p-6">

        <h1 className="text-2xl font-bold text-slate-900">
          TransitOps
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Fleet Operations Platform
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-4 py-6">

        {items.map((item) => {
          const Icon = item.icon;

          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",

                active
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
              )}
            >
              <Icon size={20} />

              <span className="font-medium">

                {item.title}

              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 p-5">

        <div className="rounded-xl bg-emerald-50 p-4">

          <p className="font-semibold text-slate-800">

            {user.name}

          </p>

          <p className="text-sm text-slate-500">

            {user.role}

          </p>

        </div>

      </div>
    </div>
  );
}