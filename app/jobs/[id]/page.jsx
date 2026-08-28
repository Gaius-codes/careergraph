import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/cognodb/jobs";

import MatchScore from "@/components/jobs/MatchScore";
import SkillBadge from "@/components/jobs/SkillBadge";

export default async function JobDetailsPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const job = await getJobById(id, user.id);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/jobs"
          className="text-xs font-bold text-slate-500 transition hover:text-indigo-600"
        >
          ← Back to Opportunities
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {job.industry && (
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {job.industry}
                  </span>
                )}

                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  {job.workType}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                {job.title}
              </h1>

              <p className="mt-2 text-base font-semibold text-slate-600">
                {job.company}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                <span className="rounded-lg bg-slate-100 px-3 py-2">
                  {job.location}
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-2">
                  {job.employmentType}
                </span>

                {job.salaryRange && (
                  <span className="rounded-lg bg-slate-100 px-3 py-2">
                    {job.salaryRange}
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                About the role
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Required skills
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Core skills expected for this opportunity.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <SkillBadge
                    key={skill.id}
                    skill={skill}
                    matched={skill.matched}
                    importance="required"
                  />
                ))}
              </div>
            </section>

            {job.preferredSkills.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Preferred skills
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Additional skills that could strengthen your application.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.preferredSkills.map((skill) => (
                    <SkillBadge
                      key={skill.id}
                      skill={skill}
                      matched={skill.matched}
                      importance="preferred"
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                About {job.company}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {job.companyDescription}
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <MatchScore
              score={job.matchScore}
              matchingRequired={job.matchingRequired}
              totalRequired={job.totalRequired}
              matchingPreferred={job.matchingPreferred}
              totalPreferred={job.totalPreferred}
            />

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Match insight
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {job.matchingRequired === job.totalRequired
                  ? "You match every required skill for this opportunity."
                  : `You match ${job.matchingRequired} of ${job.totalRequired} required skills. Review the unmatched skills before applying.`}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}