import React from "react";
import { Truck, Map, ShieldCheck, BarChart3 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override Tailwind/shadcn colors at the container boundary to enforce 
  // the dark-mode-first design specifications.
  const authStyles = {
    "--background": "210 20% 98%",        // #F8FAFC
    "--foreground": "222 47% 11%",        // #111827

    "--card": "0 0% 100%",                // White
    "--card-foreground": "222 47% 11%",

    "--popover": "0 0% 100%",
    "--popover-foreground": "222 47% 11%",

    "--primary": "142 71% 45%",           // #22C55E
    "--primary-foreground": "0 0% 100%",

    "--secondary": "210 20% 96%",         // #F1F5F9
    "--secondary-foreground": "222 47% 11%",

    "--muted": "210 20% 96%",
    "--muted-foreground": "215 16% 47%",  // #64748B

    "--accent": "142 76% 96%",            // Light Green
    "--accent-foreground": "142 71% 35%",

    "--border": "214 32% 91%",            // #E2E8F0
    "--input": "214 32% 91%",
    "--ring": "142 71% 45%",

    "--radius": "18px",
  } as React.CSSProperties;

  const rolesList = [
    {
      title: "Fleet Manager",
      description: "Oversee operational dashboards, key metrics, and fleet health.",
      icon: Truck,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Dispatcher",
      description: "Manage real-time routing, active trips, and driver scheduling.",
      icon: Map,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      title: "Safety Officer",
      description: "Monitor regulatory compliance, safety incidents, and audits.",
      icon: ShieldCheck,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      title: "Financial Analyst",
      description: "Track fuel receipts, maintenance expenditures, and reports.",
      icon: BarChart3,
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <div
      className="min-h-screen flex text-foreground antialiased font-sans select-none overflow-x-hidden bg-[#F8FAFC]"
      style={authStyles}
    >
      {/* Left Branding Panel (~40% on large screens, hidden on mobile) */}
      <div className="hidden md:flex md:w-[55%] flex-col justify-between px-8 py-6 bg-white border-r border-r border-slate-200 relative overflow-hidden shrink-0">

        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-green-100 rounded-full blur-[90px] pointer-events-none" />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Top Header Section */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] to-emerald-600 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <svg
              className="h-6 w-6 text-slate-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              TransitOps <span className="text-[11px] leading-4 bg-emerald-500/10 text-[#22C55E] px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold tracking-normal">RBAC</span>
            </h1>
            <p className="text-[11px] leading-4 text-slate-500">Fleet Operations & Management</p>
          </div>
        </div>

        {/* Center Features Showcase */}
        <div className="relative flex-1 flex flex-col justify-center py-4">
          <div className="space-y-1 mb-5">
            <span className="text-[11px] leading-4 font-semibold tracking-wider text-[#22C55E] uppercase">Platform Roles</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              One Login.<br />Four Roles.
            </h2>
            <p className="text-[11px] leading-4 text-slate-500 max-w-sm mt-2">
              Select your organization role below to access dedicated operational toolkits.
            </p>
          </div>

          <div className="grid gap-3">
            {rolesList.map((role) => (
              <div
                key={role.title}
                className="group flex gap-2 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-white/10 transition-all duration-200"
              >
                <div className={`flex size-8 items-center justify-center rounded-lg ${role.color} shrink-0`}>
                  <role.icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#22C55E] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-[11px] leading-4 text-slate-500 leading-normal max-w-[380px]">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative text-[11px] leading-4 text-slate-500">
          TransitOps &copy; 2026
        </div>
      </div>

      {/* Right Page Content Panel */}
      <div className="w-full md:w-[45%] flex flex-col justify-between p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

        {/* Helper layout padding for alignment */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-full max-w-[540px] z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
