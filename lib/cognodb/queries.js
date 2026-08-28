import { runQuery } from "./client";

function toNumber(value) {
  if (value?.toNumber) return value.toNumber();
  return Number(value || 0);
}

export async function getPersonStats(supabaseUserId) {
  const query = `
    MATCH (p:Person {supabaseUserId: $supabaseUserId})

    OPTIONAL MATCH (p)-[:HAS_SKILL]->(skill:Skill)
    WITH p, count(DISTINCT skill) AS skills

    OPTIONAL MATCH (p)-[:BUILT]->(project:Project)
    WITH skills, count(DISTINCT project) AS projects

    OPTIONAL MATCH (p)-[:HAS_SKILL]->(mySkill:Skill)
    OPTIONAL MATCH (job:Job)-[:REQUIRES]->(requiredSkill:Skill)
    WHERE requiredSkill.id = mySkill.id
    WITH skills, projects, count(DISTINCT job) AS jobMatches

    RETURN
      skills,
      projects,
      jobMatches
  `;

  const records = await runQuery(query, { supabaseUserId });

  if (!records.length) {
    return {
      skills: 0,
      projects: 0,
      jobMatches: 0,
    };
  }

  const record = records[0];

  return {
    skills: toNumber(record.get("skills")),
    projects: toNumber(record.get("projects")),
    jobMatches: toNumber(record.get("jobMatches")),
  };
}

export async function getPersonSkills(supabaseUserId) {
  const query = `
    MATCH (p:Person {supabaseUserId: $supabaseUserId})-[r:HAS_SKILL]->(s:Skill)

    RETURN
      s.id AS id,
      s.name AS name,
      s.category AS category,
      r.level AS level,
      r.years AS years

    ORDER BY s.name
  `;

  const records = await runQuery(query, { supabaseUserId });

  return records.map((record) => ({
    id: record.get("id"),
    name: record.get("name"),
    category: record.get("category"),
    level: record.get("level"),
    years: record.get("years"),
  }));
}

export async function getRecommendedJobs(supabaseUserId) {
  const query = `
    MATCH (p:Person {supabaseUserId: $supabaseUserId})
    MATCH (job:Job)

    OPTIONAL MATCH (company:Company)-[:OFFERS]->(job)
    OPTIONAL MATCH (company)-[:OPERATES_IN]->(industry:Industry)

    OPTIONAL MATCH (job)-[required:REQUIRES]->(requiredSkill:Skill)
    OPTIONAL MATCH (p)-[:HAS_SKILL]->(myRequiredSkill:Skill)
    WHERE requiredSkill.id = myRequiredSkill.id

    WITH
      p,
      job,
      company,
      industry,
      count(DISTINCT myRequiredSkill) AS matchingRequired

    OPTIONAL MATCH (job)-[:REQUIRES]->(allRequired:Skill)

    WITH
      p,
      job,
      company,
      industry,
      matchingRequired,
      count(DISTINCT allRequired) AS totalRequired

    OPTIONAL MATCH (job)-[:PREFERS]->(preferred:Skill)
    OPTIONAL MATCH (p)-[:HAS_SKILL]->(myPreferredSkill:Skill)
    WHERE preferred.id = myPreferredSkill.id

    WITH
      job,
      company,
      industry,
      matchingRequired,
      totalRequired,
      count(DISTINCT myPreferredSkill) AS matchingPreferred

    OPTIONAL MATCH (job)-[:PREFERS]->(allPreferred:Skill)

    WITH
      job,
      company,
      industry,
      matchingRequired,
      totalRequired,
      matchingPreferred,
      count(DISTINCT allPreferred) AS totalPreferred

    WITH
      job,
      company,
      industry,
      matchingRequired,
      totalRequired,
      matchingPreferred,
      totalPreferred,
      CASE
        WHEN totalRequired = 0 THEN 0
        ELSE
          (toFloat(matchingRequired) / totalRequired) * 80
          +
          CASE
            WHEN totalPreferred = 0 THEN 0
            ELSE (toFloat(matchingPreferred) / totalPreferred) * 20
          END
      END AS matchScore

    RETURN
      job.id AS id,
      job.title AS title,
      company.id AS companyId,
      company.name AS company,
      company.description AS companyDescription,
      industry.name AS industry,
      job.location AS location,
      job.workType AS workType,
      job.employmentType AS employmentType,
      job.salaryRange AS salaryRange,
      job.description AS description,
      matchingRequired,
      totalRequired,
      matchingPreferred,
      totalPreferred,
      matchingRequired + matchingPreferred AS matchingSkills,
      round(matchScore) AS matchScore

    ORDER BY matchScore DESC, job.title ASC
    LIMIT 5
  `;

  const records = await runQuery(query, { supabaseUserId });

  return records.map((record) => ({
    id: record.get("id"),
    title: record.get("title"),
    company: record.get("company"),
    companyId: record.get("companyId"),
    companyDescription: record.get("companyDescription"),
    industry: record.get("industry"),
    location: record.get("location"),
    workType: record.get("workType"),
    employmentType: record.get("employmentType"),
    salaryRange: record.get("salaryRange"),
    description: record.get("description"),
    matchingRequired: toNumber(record.get("matchingRequired")),
    totalRequired: toNumber(record.get("totalRequired")),
    matchingPreferred: toNumber(record.get("matchingPreferred")),
    totalPreferred: toNumber(record.get("totalPreferred")),
    matchingSkills: toNumber(record.get("matchingSkills")),
    matchScore: toNumber(record.get("matchScore")),
  }));
}

export async function getSkillGaps(supabaseUserId) {
  const query = `
    MATCH (job:Job)-[:REQUIRES]->(requiredSkill:Skill)

    WHERE NOT EXISTS {
      MATCH (p:Person {supabaseUserId: $supabaseUserId})-[:HAS_SKILL]->(requiredSkill)
    }

    RETURN
      requiredSkill.id AS id,
      requiredSkill.name AS name,
      requiredSkill.category AS category,
      count(DISTINCT job) AS jobCount

    ORDER BY jobCount DESC
    LIMIT 5
  `;

  const records = await runQuery(query, { supabaseUserId });

  return records.map((record) => ({
    id: record.get("id"),
    name: record.get("name"),
    category: record.get("category"),
    jobCount: toNumber(record.get("jobCount")),
  }));
}