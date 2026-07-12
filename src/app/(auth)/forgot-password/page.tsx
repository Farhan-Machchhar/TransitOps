"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return "Please enter a valid email address (e.g. user@domain.com)";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API loading state for 1.5 seconds
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <Card className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 p-8 transition-all duration-200">      {!success ? (
      <>
        <CardHeader className="p-0 mb-6 space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700"
                >
                  Email Address
                </label>
                {error && (
                  <span className="text-[11px] text-red-600 font-medium">
                    {error}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-emerald-400">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) {
                      setError(validateEmail(e.target.value));
                    }
                  }}
                  onBlur={() => {
                    setError(validateEmail(email));
                  }}
                  disabled={loading}
                  aria-invalid={!!error}
                  className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100 transition-all " />
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 m-4 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-slate-900 shadow-md shadow-emerald-200 hover:bg-emerald-600 rounded-xl h-11 font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors py-1 cursor-pointer self-center"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </>
    ) : (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-[#22C55E] mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Check your email
        </h3>
        <p className="text-xs text-slate-500 mt-2 max-w-[280px] leading-relaxed">
          We have sent a secure password reset link to <strong className="text-emerald-500 underline font-medium">{email}</strong>.
        </p>
        <div className="mt-8 w-full">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors py-2.5 border border-slate-300 hover:border-emerald-500 rounded-[12px] bg-white hover:bg-emerald-100 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to sign in
          </Link>
        </div>
      </div>
    )}
    </Card>
  );
}
