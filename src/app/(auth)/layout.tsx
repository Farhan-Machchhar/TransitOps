import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] text-foreground">

      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-[55%] relative border-r border-slate-200 overflow-hidden">

        <Image
          src="/login-hero.png"
          alt="TransitOps Fleet"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-900/20" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <span className="text-lg font-bold text-zinc-950">T</span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                TransitOps
              </h1>
              <p className="text-sm text-zinc-300">
                Fleet Operations Platform
              </p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="max-w-md">

            <h2 className="text-4xl font-bold leading-tight text-white">
              Visibility.
              <br />
              Efficiency.
              <br />
              Sustainability.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-300">
              Manage your fleet operations from a single intelligent platform
              with real-time insights and analytics.
            </p>

            <Link
              href="#"
              className="mt-6 inline-flex items-center text-emerald-400 hover:text-emerald-300"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

          </div>

          {/* Footer */}
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} TransitOps
          </p>

        </div>
      </div>

      {/* Right Form */}
      <div className="relative flex w-full lg:w-[45%] items-center justify-center px-6 py-6 bg-background text-foreground">
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}