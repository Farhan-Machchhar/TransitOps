import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Wrench, BarChart3, LayoutDashboard, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-foreground overflow-hidden selection:bg-emerald-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-700/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-md border-b border-white/5 bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="TransitOps Logo" width={130} height={32} className="object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="hidden sm:flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-all hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-12 lg:px-24">
        
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Now Live: The Hackathon Edition
        </div>
        
        <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Smart Transport <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Operations Platform</span>
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
          Digitize your entire logistics workflow. Manage vehicles, track drivers, orchestrate dispatching, schedule maintenance, and analyze expenses—all enforced by intelligent business rules.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link href="/signup" className="flex h-14 items-center justify-center rounded-xl bg-emerald-600 px-8 text-base font-semibold text-white transition-all hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1">
            Start Optimizing Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/login" className="flex h-14 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 text-base font-semibold text-white transition-all hover:bg-zinc-800 hover:border-zinc-600 backdrop-blur-md">
            Go to Dashboard
          </Link>
        </div>

        {/* Dashboard Preview Glass Card */}
        <div className="mt-20 w-full max-w-6xl rounded-2xl border border-white/10 bg-zinc-900/40 p-2 sm:p-4 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
          <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950">
            {/* Mock Dashboard UI */}
            <div className="h-[400px] sm:h-[500px] w-full bg-zinc-950 flex flex-col relative opacity-80">
               {/* Mock Header */}
               <div className="h-14 border-b border-zinc-800 flex items-center px-6">
                 <div className="h-6 w-32 bg-zinc-800 rounded-md"></div>
                 <div className="ml-auto flex gap-4">
                   <div className="h-8 w-8 bg-zinc-800 rounded-full"></div>
                   <div className="h-8 w-8 bg-zinc-800 rounded-full"></div>
                 </div>
               </div>
               {/* Mock Content */}
               <div className="flex flex-1 p-6 gap-6">
                 {/* Sidebar */}
                 <div className="hidden md:flex w-48 flex-col gap-4">
                   <div className="h-8 w-full bg-emerald-500/20 rounded-md"></div>
                   <div className="h-8 w-full bg-zinc-800 rounded-md"></div>
                   <div className="h-8 w-full bg-zinc-800 rounded-md"></div>
                   <div className="h-8 w-full bg-zinc-800 rounded-md"></div>
                 </div>
                 {/* Main Area */}
                 <div className="flex-1 flex flex-col gap-6">
                   <div className="flex gap-4">
                     <div className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                       <div className="h-4 w-16 bg-zinc-700 rounded-sm"></div>
                       <div className="h-8 w-24 bg-zinc-600 rounded-md"></div>
                     </div>
                     <div className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                       <div className="h-4 w-16 bg-zinc-700 rounded-sm"></div>
                       <div className="h-8 w-24 bg-zinc-600 rounded-md"></div>
                     </div>
                     <div className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hidden sm:flex">
                       <div className="h-4 w-16 bg-zinc-700 rounded-sm"></div>
                       <div className="h-8 w-24 bg-zinc-600 rounded-md"></div>
                     </div>
                   </div>
                   <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col p-4 gap-4">
                      <div className="h-4 w-32 bg-zinc-700 rounded-sm mb-2"></div>
                      <div className="h-12 w-full bg-zinc-800 rounded-md"></div>
                      <div className="h-12 w-full bg-zinc-800 rounded-md"></div>
                      <div className="h-12 w-full bg-zinc-800 rounded-md"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 w-full bg-zinc-950 py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              End-to-End Fleet Lifecycle
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
              Everything you need to run an efficient logistics network, built natively for your operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Vehicle Registry</h3>
              <p className="text-zinc-400 leading-relaxed">
                Maintain a master list of vehicles with capacities, odometers, and real-time status (Available, On Trip, In Shop).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Driver Compliance</h3>
              <p className="text-zinc-400 leading-relaxed">
                Track licenses, safety scores, and duty status. Automatically block suspended or expired drivers from dispatch.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Smart Dispatching</h3>
              <p className="text-zinc-400 leading-relaxed">
                Create trips with auto-validation for load capacities. Instantly update vehicle and driver statuses when dispatched.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Maintenance Workflows</h3>
              <p className="text-zinc-400 leading-relaxed">
                Log service records. Opening a maintenance ticket automatically pulls the vehicle out of the active dispatch pool.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Fuel & Expenses</h3>
              <p className="text-zinc-400 leading-relaxed">
                Record fuel logs and tolls. Automatically compute total operational costs per vehicle to calculate exact ROI.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:bg-zinc-800/50 hover:border-emerald-500/30">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Role-Based Access</h3>
              <p className="text-zinc-400 leading-relaxed">
                Custom views for Fleet Managers, Drivers, Safety Officers, and Financial Analysts to keep operations secure.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-zinc-950 py-8 px-6 text-center text-zinc-500">
        <p>© {new Date().getFullYear()} TransitOps Platform. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}
