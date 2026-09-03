import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // sign-out handler
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Derive initial for avatar placeholder
  const initial = user.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200/80 bg-white md:flex">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-sm font-extrabold text-white shadow-md shadow-indigo-500/20">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            CareerGraph
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 transition"
          >
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Overview
          </Link>
          
          {/* Placeholder items for layout balance */}
          <div className="pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-3.5">
            Analytics
          </div>
          <Link
            href="/explorer"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Graph Insights
          </Link>
        </nav>

        {/* Bottom User Card */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-bold text-indigo-700">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {user.email}
                </p>
                <p className="text-[10px] text-slate-400">Authenticated</p>
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-red-600 hover:shadow-xs"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-bold text-white">
              C
            </div>
            <span className="font-bold text-slate-900">CareerGraph</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-semibold text-slate-600 transition hover:text-red-600 cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}