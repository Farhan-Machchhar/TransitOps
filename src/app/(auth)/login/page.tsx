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
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    // No need to set loading to false as it redirects
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 flex-col justify-between p-12 overflow-hidden border-r border-border">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-hero.png"
            alt="TransitOps Fleet"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20">
            <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-xl leading-none">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TransitOps</span>
          </div>
          
          <div className="max-w-md mt-auto">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Visibility, Efficiency, Sustainability</h1>
            <p className="text-zinc-400 text-lg mb-8">
              The Most Efficient Fleet Network. Manage your operations in real-time with unparalleled precision.
            </p>
            <Link 
              href="#" 
              className="inline-flex items-center text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
            >
              Join TransitOps Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative">
        <div className="flex justify-end hidden sm:flex">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="#" className="font-medium text-emerald-500 hover:text-emerald-400">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-10 text-center lg:text-left">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-zinc-950 font-bold text-xl leading-none">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">TransitOps</span>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard Log In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your fleet operations.</p>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full mb-6 border-border bg-transparent hover:bg-zinc-900 h-12 relative flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
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
              disabled={loading || googleLoading}
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
