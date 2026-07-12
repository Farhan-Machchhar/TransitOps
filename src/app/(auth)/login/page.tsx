"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };



  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 flex-col p-12 overflow-hidden border-r border-border">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-700/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="TransitOps Logo" width={160} height={40} className="object-contain" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-6 tracking-tight leading-tight">
              Visibility, Efficiency, <br /> Sustainability.
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed mb-10 font-medium">
              The Most Efficient Fleet Network. Manage your operations in real-time with unparalleled precision and actionable analytics.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors text-lg"
            >
              Start your journey today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative">
        <div className="flex justify-end hidden sm:flex">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-emerald-500 hover:text-emerald-400">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <Image src="/logo.png" alt="TransitOps Logo" width={140} height={32} className="object-contain" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard Log In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your fleet operations.</p>
          </div>



          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm font-medium text-red-500 text-center">{error}</div>}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email Address</label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@transitops.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pr-10 bg-zinc-900/50 border-border focus-visible:ring-emerald-500"
                  required
                />
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                <Link href="#" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10 bg-zinc-900/50 border-border focus-visible:ring-emerald-500"
                  required
                />
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <Button 
              className="w-full h-12 mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium group flex items-center justify-center gap-2" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </div>

        <div className="flex justify-center sm:justify-start mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} TransitOps Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
