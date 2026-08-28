import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPersonBySupabaseId } from "@/lib/cognodb/person";
import { getAllJobs } from "@/lib/cognodb/jobs";
import JobCard from "@/components/jobs/JobCard";

export default async function JobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const person = await getPersonBySupabaseId(user.id);

  if (!person) {
    redirect("/dashboard");
  }

  const jobs = await getAllJobs(user.id);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-slate-500 hover:text-indigo-600"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Career Opportunities
          </span>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Opportunities matched to your graph
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Explore roles ranked by how closely their required and preferred
            skills align with your career profile.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            {jobs.length} opportunities
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="font-bold text-slate-800">
                No opportunities found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There are currently no opportunities connected to your career
                graph.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}