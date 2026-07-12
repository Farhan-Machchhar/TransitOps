"use client";

import {
  Bell,
  Search,
} from "lucide-react";

interface Props {
  user: {
    name?: string | null;
    image?: string | null;
    role: string;
  };
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-emerald-100 text-emerald-700",
  DISPATCHER: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  FINANCE: "bg-purple-100 text-purple-700",
  "Fleet Manager": "bg-emerald-100 text-emerald-700",
  Dispatcher: "bg-blue-100 text-blue-700",
  "Safety Officer": "bg-amber-100 text-amber-700",
  "Financial Analyst": "bg-purple-100 text-purple-700",
};

export default function TopNavbar({
  user,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-8">

        {/* Search */}

        <div className="relative w-full max-w-md">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            placeholder="Search vehicles, drivers..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
          />

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          <button className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">

            <Bell size={18} />

          </button>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              roleColors[user.role] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {user.role}
          </span>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 font-semibold text-white">

              {user.name?.charAt(0)}

            </div>

            <div className="hidden md:block">

              <p className="font-semibold text-slate-800">

                {user.name}

              </p>

              <p className="text-sm text-slate-500">

                {user.role}

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}