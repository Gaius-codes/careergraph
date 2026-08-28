import neo4j from "neo4j-driver";

let driver;

function getDriver() {
  if (driver) {
    return driver;
  }

  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME || "cognodb";
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !username || !password) {
    throw new Error(
      "Missing required environment variables for Cognodb connection.",
    );
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  return driver;
}

export async function runQuery(query, params = {}) {
  const db = getDriver();
  const session = db.session();

  try {
    const result = await session.run(query, params);

    return result.records;
  } finally {
    await session.close();
  }
}
