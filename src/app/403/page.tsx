export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800">403</h1>
        <p className="mt-4 text-xl text-slate-600">Access Forbidden</p>
        <p className="mt-2 text-slate-500">You do not have permission to view this page.</p>
        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
