import { runQuery } from "./client";

function toNumber(value) {
  return value?.toNumber ? value.toNumber() : Number(value || 0);
}

function recordToJob(record) {
  return {
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
  };
}

export async function getAllJobs(supabaseUserId) {
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
  `;

  const records = await runQuery(query, { supabaseUserId });

  return records.map(recordToJob);
}

export async function getJobById(jobId, supabaseUserId) {
  const query = `
    MATCH (p:Person {supabaseUserId: $supabaseUserId})
    MATCH (job:Job {id: $jobId})

    OPTIONAL MATCH (company:Company)-[:OFFERS]->(job)
    OPTIONAL MATCH (company)-[:OPERATES_IN]->(industry:Industry)

    OPTIONAL MATCH (job)-[required:REQUIRES]->(requiredSkill:Skill)
    WITH
      p,
      job,
      company,
      industry,
      collect({
        id: requiredSkill.id,
        name: requiredSkill.name,
        category: requiredSkill.category,
        importance: "required",
        matched: EXISTS {
          MATCH (p)-[:HAS_SKILL]->(requiredSkill)
        }
      }) AS requiredSkills

    OPTIONAL MATCH (job)-[preferred:PREFERS]->(preferredSkill:Skill)
    WITH
      p,
      job,
      company,
      industry,
      requiredSkills,
      collect({
        id: preferredSkill.id,
        name: preferredSkill.name,
        category: preferredSkill.category,
        importance: "preferred",
        matched: EXISTS {
          MATCH (p)-[:HAS_SKILL]->(preferredSkill)
        }
      }) AS preferredSkills

    WITH
      job,
      company,
      industry,
      requiredSkills,
      preferredSkills,

      size([skill IN requiredSkills WHERE skill.matched = true])
        AS matchingRequired,

      size([skill IN preferredSkills WHERE skill.matched = true])
        AS matchingPreferred

    RETURN
      job.id AS id,
      job.title AS title,
      job.location AS location,
      job.workType AS workType,
      job.employmentType AS employmentType,
      job.salaryRange AS salaryRange,
      job.description AS description,

      company.id AS companyId,
      company.name AS company,
      company.description AS companyDescription,

      industry.name AS industry,

      requiredSkills,
      preferredSkills,

      matchingRequired,
      size(requiredSkills) AS totalRequired,
      matchingPreferred,
      size(preferredSkills) AS totalPreferred,

      round(
        CASE
          WHEN size(requiredSkills) = 0 THEN 0
          ELSE
            (toFloat(matchingRequired) / size(requiredSkills)) * 80
            +
            CASE
              WHEN size(preferredSkills) = 0 THEN 0
              ELSE
                (toFloat(matchingPreferred) / size(preferredSkills)) * 20
            END
        END
      ) AS matchScore
  `;

  const records = await runQuery(query, {
    jobId,
    supabaseUserId,
  });

  if (!records.length) {
    return null;
  }

  const record = records[0];

  return {
    id: record.get("id"),
    title: record.get("title"),
    location: record.get("location"),
    workType: record.get("workType"),
    employmentType: record.get("employmentType"),
    salaryRange: record.get("salaryRange"),
    description: record.get("description"),

    companyId: record.get("companyId"),
    company: record.get("company"),
    companyDescription: record.get("companyDescription"),
    industry: record.get("industry"),

    requiredSkills: record.get("requiredSkills") || [],
    preferredSkills: record.get("preferredSkills") || [],

    matchingRequired: toNumber(record.get("matchingRequired")),
    totalRequired: toNumber(record.get("totalRequired")),
    matchingPreferred: toNumber(record.get("matchingPreferred")),
    totalPreferred: toNumber(record.get("totalPreferred")),
    matchScore: toNumber(record.get("matchScore")),
  };
}