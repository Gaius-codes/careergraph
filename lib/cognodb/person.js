import { runQuery } from "./client";

export async function getPersonBySupabaseId(supabaseUserId) {
  const query = `
    MATCH (p:Person {supabaseUserId: $supabaseUserId})
    RETURN
      p.id AS id,
      p.name AS name,
      p.title AS title,
      p.location AS location,
      p.summary AS summary
    LIMIT 1
  `;

  const records = await runQuery(query, { supabaseUserId });

  if (!records.length) {
    return null;
  }

  const record = records[0];

  return {
    id: record.get("id"),
    name: record.get("name"),
    title: record.get("title"),
    location: record.get("location"),
    summary: record.get("summary"),
  };
}