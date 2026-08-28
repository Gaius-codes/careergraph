import {
  getPersonStats,
  getPersonSkills,
  getRecommendedJobs,
  getSkillGaps,
} from "./queries";

import { getPersonBySupabaseId } from "./person";

export async function getDashboardData(supabaseUserId) {
  const person = await getPersonBySupabaseId(supabaseUserId);

  if (!person) {
    return null;
  }

  const [stats, skills, jobs, skillGaps] = await Promise.all([
    getPersonStats(supabaseUserId),
    getPersonSkills(supabaseUserId),
    getRecommendedJobs(supabaseUserId),
    getSkillGaps(supabaseUserId),
  ]);

  return {
    stats: {
      ...stats,
      skillGaps: skillGaps.length,
    },
    skills,
    jobs,
    skillGaps,
  };
}
