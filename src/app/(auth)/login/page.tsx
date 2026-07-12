"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Loader2,
  Sliders,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DemoAccount = {
  role: string;
  email: string;
  password: string;
};

const demoAccounts: DemoAccount[] = [
  {
    role: "Fleet Manager",
    email: "admin@transitops.dev",
    password: "password123",
  },
  {
    role: "Dispatcher",
    email: "dispatcher@transitops.dev",
    password: "password123",
  },
  {
    role: "Safety Officer",
    email: "maintenance@transitops.dev",
    password: "password123",
  },
  {
    role: "Financial Analyst",
    email: "finance@transitops.dev",
    password: "password123",
  },
];

export default function LoginPage() {
  const router = useRouter();

  // Standard Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation & Interaction States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  // Simulation & Debug States
  const [isLoading, setIsLoading] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(300); // 5 mins in seconds
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Auto Countdown for Locked State
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Validation functions
  const checkEmail = (val: string) => {
    if (!val) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Invalid email address format";
    return "";
  };

  const checkPassword = (val: string) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Live validation on blur
  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setEmailError(checkEmail(email));
    }
    if (field === "password") {
      setPasswordError(checkPassword(password));
    }
  };

  const handleRoleChange = (val: string | null) => {
    setRole(val || "");
    setRoleError(val ? "" : "Please select your role to proceed");
  };

  // Handle actual submission (with mock simulation fallback)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final check
    const mailErr = checkEmail(email);
    const passErr = checkPassword(password);
    const rlErr = role ? "" : "Please select your role to proceed";

    setEmailError(mailErr);
    setPasswordError(passErr);
    setRoleError(rlErr);
    setTouched({ email: true, password: true });

    if (mailErr || passErr || rlErr) {
      return;
    }

    setIsLoading(true);
    setActiveError(null);

    // If simulating special errors, handle that instead of NextAuth
    if (email === "error@transitops.dev") {
      setTimeout(() => {
        setIsLoading(false);
        setActiveError("invalid-credentials");
      }, 1500);
      return;
    }
    if (email === "locked@transitops.dev") {
      setTimeout(() => {
        setIsLoading(false);
        setIsLocked(true);
        setLockTimeRemaining(300);
        setActiveError("locked");
      }, 1500);
      return;
    }
    if (email === "mismatch@transitops.dev") {
      setTimeout(() => {
        setIsLoading(false);
        setActiveError("role-mismatch");
      }, 1500);
      return;
    }
    if (email === "network@transitops.dev") {
      setTimeout(() => {
        setIsLoading(false);
        setActiveError("network-error");
      }, 1500);
      return;
    }
    if (email === "server@transitops.dev") {
      setTimeout(() => {
        setIsLoading(false);
        setActiveError("server-error");
      }, 1500);
      return;
    }

    // Default successful login simulation
    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setActiveError("invalid-credentials");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const loadDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);

    setActiveError(null);
  };

  const isFormValid = email && password && role && !emailError && !passwordError && !roleError;

  return (
    <>
      <Card className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 p-8 transition-all duration-200 relative overflow-hidden">
        {/* Decorative Green Accent Border on Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#22C55E]" />

        {/* Card Header */}
        <CardHeader className="p-0 mb-6 space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        {/* Error Alert Display */}
        {activeError && !isLocked && (
          <div className="mb-5 p-3.5 bg-red-50  border border-red-200 text-red-700 rounded-[12px] flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="h-4.5 w-4.5 text-red-700 shrink-0 mt-0.5" />
            <div className="text-xs text-red-700 leading-normal">
              {activeError === "invalid-credentials" && "Invalid email or password. Please double-check your credentials."}
              {activeError === "role-mismatch" && "Role Mismatch: The credentials supplied are not authorized for this specific role."}
              {activeError === "network-error" && "Network error. Failed to establish connection to the server."}
              {activeError === "server-error" && "Server Error (500). Internal server error occurred."}
            </div>
          </div>
        )}

        {/* Account Locked UI Alert Display */}
        {isLocked && (
          <div className="mb-5 p-3.5 bg-amber-50 text-amber-700 border border-amber-500/20 rounded-[12px] flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-normal">
                Account locked after 5 failed login attempts. Please contact your system administrator or reset your password.
              </div>
            </div>
            <div className="flex justify-between items-center text-xs border-amber-500/10 pt-2.5">
              <span className="text-amber-400/80 font-medium">
                Locked countdown: <span className="font-mono text-amber-400 font-bold">{formatTime(lockTimeRemaining)}</span>
              </span>
              <Link
                href="/forgot-password"
                className="text-slate-900 hover:underline hover:text-[#22C55E] transition-colors"
              >
                Reset Password
              </Link>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleLoginSubmit} noValidate className={isLoading ? "opacity-60 pointer-events-none transition-opacity duration-200" : ""}>
          <CardContent className="p-0 space-y-4">

            {/* Email Input Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="email" className="text-xs font-semibold text-slate-900/95">
                  Email Address
                </label>
                {touched.email && emailError && (
                  <span className="text-[11px] text-red-400 font-medium">{emailError}</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-emerald-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="dispatcher@transitops.dev"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setEmailError(checkEmail(e.target.value));
                  }}
                  onBlur={() => handleBlur("email")}
                  disabled={isLoading || isLocked}
                  aria-invalid={!!(touched.email && emailError)}
                  className="pl-9 bg-white border-slate-300 hover:border-slate-400 focus-visible:border-[#22C55E] focus-visible:ring-[#22C55E]/20 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-4 rounded-[12px] h-10 placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-900/95">
                  Password
                </label>
                {touched.password && passwordError && (
                  <span className="text-[11px] text-red-400 font-medium">{passwordError}</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-emerald-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) setPasswordError(checkPassword(e.target.value));
                  }}
                  onBlur={() => handleBlur("password")}
                  disabled={isLoading || isLocked}
                  aria-invalid={!!(touched.password && passwordError)}
                  className="pl-9 bg-white border-slate-300 hover:border-slate-400 focus-visible:border-[#22C55E] focus-visible:ring-[#22C55E]/20 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-4 rounded-[12px] h-10 placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role Select Dropdown Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-900/95">
                  Assigned RBAC Role
                </label>
                {roleError && (
                  <span className="text-[11px] text-red-400 font-medium">{roleError}</span>
                )}
              </div>
              <Select value={role} onValueChange={handleRoleChange} disabled={isLoading || isLocked}>
                <SelectTrigger
                  aria-invalid={!!roleError}
                  className="w-full h-10 bg-white border-slate-200 hover:border-slate-50 focus-visible:border-[#22C55E] focus-visible:ring-[#22C55E]/20 text-slate-900 rounded-[12px] flex items-center justify-between text-sm pr-2 pl-3 cursor-pointer"
                >
                  <SelectValue placeholder="Choose profile role" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-white/10 text-slate-900 rounded-xl shadow-2xl p-1 animate-fadeIn">
                  <SelectItem value="Fleet Manager" className="rounded-md py-2 text-sm hover:bg-slate-300 focus:bg-slate-300/[0.04] cursor-pointer">
                    Fleet Manager
                  </SelectItem>
                  <SelectItem value="Dispatcher" className="rounded-md py-2 text-sm hover:bg-slate-300 focus:bg-slate-300/[0.04] cursor-pointer">
                    Dispatcher
                  </SelectItem>
                  <SelectItem value="Safety Officer" className="rounded-md py-2 text-sm hover:bg-slate-300 focus:bg-slate-300/[0.04] cursor-pointer">
                    Safety Officer
                  </SelectItem>
                  <SelectItem value="Financial Analyst" className="rounded-md py-2 text-sm hover:bg-slate-300 focus:bg-slate-300/[0.04] cursor-pointer">
                    Financial Analyst
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Remember Me Checkbox & Forgot Password Link */}
            <div className="flex items-center justify-between text-xs pt-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading || isLocked}
                  className="accent-[#22C55E] h-4 w-4 rounded border-white/10 bg-emerald-50 border border-emerald-100 rounded-xl p-4 focus:ring-[#22C55E]/20 focus:ring-offset-[#151C28] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>

          {/* Card Footer Actions */}
          <CardFooter className="p-0 m-4 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading || isLocked || !isFormValid}
              className="w-full h-11 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold shadow-md shadow-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Information Card */}
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <p className="text-xs text-slate-600">
                Your role determines the dashboards and features available after sign in.
              </p>
            </div>
          </CardFooter>

          <div className="space-y-3 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Demo Accounts
            </p>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => loadDemoAccount(account)}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-left
                    transition-all
                    hover:border-emerald-500
                    hover:bg-emerald-50
                    hover:shadow-sm
                "
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {account.role}
                  </p>

                  <p className="text-xs text-slate-500">
                    Load demo account
                  </p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
