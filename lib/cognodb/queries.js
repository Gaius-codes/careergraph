import { runQuery } from "./client";

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
    skills: record.get("skills").toNumber(),
    projects: record.get("projects").toNumber(),
    jobMatches: record.get("jobMatches").toNumber(),
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
    MATCH (p:Person {supabaseUserId: $supabaseUserId})-[:HAS_SKILL]->(skill:Skill)
    MATCH (job:Job)-[r:REQUIRES]->(skill)

    OPTIONAL MATCH (company:Company)-[:OFFERS]->(job)

    WITH
      job,
      company,
      count(DISTINCT skill) AS matchingSkills

    RETURN
      job.id AS id,
      job.title AS title,
      company.name AS company,
      job.location AS location,
      job.workType AS workType,
      job.employmentType AS employmentType,
      job.salaryRange AS salaryRange,
      matchingSkills

    ORDER BY matchingSkills DESC
    LIMIT 5
  `;

  const records = await runQuery(query, { supabaseUserId });

  return records.map((record) => ({
    id: record.get("id"),
    title: record.get("title"),
    company: record.get("company"),
    location: record.get("location"),
    workType: record.get("workType"),
    employmentType: record.get("employmentType"),
    salaryRange: record.get("salaryRange"),
    matchingSkills: record.get("matchingSkills").toNumber(),
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
    jobCount: record.get("jobCount").toNumber(),
  }));
}