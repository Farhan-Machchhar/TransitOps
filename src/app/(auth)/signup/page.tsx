"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, ShieldCheck, User } from "lucide-react";

const ROLES = [
  { value: "ADMIN", label: "Fleet Manager / Safety Officer", icon: ShieldCheck },
  { value: "DISPATCHER", label: "Driver / Dispatcher", icon: User },
  { value: "FINANCE", label: "Financial Analyst", icon: User },
  { value: "MAINTENANCE", label: "Maintenance Team", icon: User },
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("DISPATCHER"); // Default to driver/dispatcher
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // 1. Register the user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // 2. Automatically log them in after registration
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Account created, but failed to log in automatically.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              Digitize Your <br /> Operations.
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed mb-10 font-medium">
              Join TransitOps and take absolute control of your dispatch, maintenance, and expense management in one beautifully designed platform.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors text-lg"
            >
              Already have an account? Log In <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-y-auto">
        <div className="flex justify-end hidden sm:flex">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
              Log In
            </Link>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
          <div className="mb-8 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <Image src="/logo.png" alt="TransitOps Logo" width={140} height={32} className="object-contain" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an Account</h2>
            <p className="text-muted-foreground">Set up your workspace to manage your fleet operations.</p>
          </div>



          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm font-medium text-red-500 text-center">{error}</div>}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email Address</label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pr-10 bg-zinc-900/50 border-border focus-visible:ring-emerald-500"
                  required
                />
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">Confirm</label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pr-10 bg-zinc-900/50 border-border focus-visible:ring-emerald-500"
                    required
                  />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium leading-none">Select Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {ROLES.map((r) => (
                  <div
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col gap-2 transition-all duration-200 ${
                      role === r.value 
                        ? "border-emerald-500 bg-emerald-500/10" 
                        : "border-border bg-zinc-900/50 hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <r.icon className={`h-5 w-5 ${role === r.value ? "text-emerald-500" : "text-zinc-500"}`} />
                      {role === r.value && (
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${role === r.value ? "text-emerald-400" : "text-zinc-300"}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-12 mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium group flex items-center justify-center gap-2" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </div>

        <div className="flex justify-center sm:justify-start mt-8 text-xs text-muted-foreground pt-4">
          © {new Date().getFullYear()} TransitOps Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
