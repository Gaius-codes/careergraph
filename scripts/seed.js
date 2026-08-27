import path from "path";
import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME || "cognodb";
const password = process.env.COGNODB_PASSWORD;

if (!uri || !password) {
  console.error(
    "Missing COGNODB_URI or COGNODB_PASSWORD environment variables.",
  );
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

const session = driver.session();

const industries = [
  { id: "industry-saas", name: "SaaS" },
  { id: "industry-fintech", name: "FinTech" },
  { id: "industry-healthtech", name: "HealthTech" },
  { id: "industry-ecommerce", name: "E-Commerce" },
  { id: "industry-devtools", name: "Developer Tools" },
  { id: "industry-climatetech", name: "ClimateTech" },
];

const technologies = [
  { id: "tech-react", name: "React" },
  { id: "tech-nextjs", name: "Next.js" },
  { id: "tech-nodejs", name: "Node.js" },
  { id: "tech-express", name: "Express.js" },
  { id: "tech-postgresql", name: "PostgreSQL" },
  { id: "tech-supabase", name: "Supabase" },
  { id: "tech-tailwind", name: "Tailwind CSS" },
  { id: "tech-framer", name: "Framer Motion" },
  { id: "tech-cognodb", name: "CognoDB" },
  { id: "tech-git", name: "Git" },
  { id: "tech-github", name: "GitHub" },
];

const skills = [
  {
    id: "skill-javascript",
    name: "JavaScript",
    category: "Frontend",
  },
  {
    id: "skill-typescript",
    name: "TypeScript",
    category: "Frontend",
  },
  {
    id: "skill-react",
    name: "React",
    category: "Frontend",
  },
  {
    id: "skill-nextjs",
    name: "Next.js",
    category: "Frontend",
  },
  {
    id: "skill-html",
    name: "HTML",
    category: "Frontend",
  },
  {
    id: "skill-css",
    name: "CSS",
    category: "Frontend",
  },
  {
    id: "skill-tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
  },
  {
    id: "skill-responsive",
    name: "Responsive Design",
    category: "Frontend",
  },
  {
    id: "skill-uiux",
    name: "UI/UX",
    category: "Frontend",
  },
  {
    id: "skill-node",
    name: "Node.js",
    category: "Backend",
  },
  {
    id: "skill-express",
    name: "Express.js",
    category: "Backend",
  },
  {
    id: "skill-rest",
    name: "REST APIs",
    category: "Backend",
  },
  {
    id: "skill-auth",
    name: "Authentication",
    category: "Backend",
  },
  {
    id: "skill-postgresql",
    name: "PostgreSQL",
    category: "Database",
  },
  {
    id: "skill-sql",
    name: "SQL",
    category: "Database",
  },
  {
    id: "skill-api",
    name: "API Integration",
    category: "Backend",
  },
  {
    id: "skill-git",
    name: "Git",
    category: "Development",
  },
  {
    id: "skill-github",
    name: "GitHub",
    category: "Development",
  },
  {
    id: "skill-debugging",
    name: "Debugging",
    category: "Development",
  },
  {
    id: "skill-python",
    name: "Python",
    category: "Emerging",
  },
  {
    id: "skill-ai",
    name: "AI Integration",
    category: "Emerging",
  },
];

const companies = [
  {
    id: "company-novastack",
    name: "NovaStack",
    description:
      "A cloud SaaS platform helping distributed teams manage engineering workflows.",
    industryId: "industry-saas",
  },
  {
    id: "company-finora",
    name: "Finora",
    description:
      "A fintech platform providing financial tools for growing businesses.",
    industryId: "industry-fintech",
  },
  {
    id: "company-healthbridge",
    name: "HealthBridge",
    description:
      "A healthcare technology company building tools for digital patient coordination.",
    industryId: "industry-healthtech",
  },
  {
    id: "company-orbitdesk",
    name: "OrbitDesk",
    description:
      "A SaaS customer operations platform for modern service businesses.",
    industryId: "industry-saas",
  },
  {
    id: "company-marketpilot",
    name: "MarketPilot",
    description: "An e-commerce intelligence platform for online retailers.",
    industryId: "industry-ecommerce",
  },
  {
    id: "company-devflow",
    name: "DevFlow",
    description:
      "Developer tooling that helps engineering teams ship and monitor software.",
    industryId: "industry-devtools",
  },
  {
    id: "company-atlaspay",
    name: "AtlasPay",
    description:
      "A payments infrastructure company focused on cross-border transactions.",
    industryId: "industry-fintech",
  },
  {
    id: "company-cloudforge",
    name: "CloudForge",
    description:
      "Cloud infrastructure tools for deploying and operating modern applications.",
    industryId: "industry-devtools",
  },
  {
    id: "company-caresync",
    name: "CareSync",
    description:
      "A healthcare SaaS platform connecting providers, patients, and care teams.",
    industryId: "industry-healthtech",
  },
  {
    id: "company-greengrid",
    name: "GreenGrid",
    description:
      "Software for monitoring and optimizing distributed energy systems.",
    industryId: "industry-climatetech",
  },
];

const projects = [
  {
    id: "project-newsletter",
    name: "Newsletter Subscription Service",
    description:
      "A production-ready newsletter subscription service with validation, duplicate handling, and a responsive interface.",
  },
  {
    id: "project-movue",
    name: "Movue",
    description:
      "A movie discovery application using external APIs, authentication, and personalized watchlists.",
  },
  {
    id: "project-savora",
    name: "Savora Restaurant",
    description:
      "A responsive restaurant website focused on clean UI, navigation, and mobile-first presentation.",
  },
  {
    id: "project-dashboard",
    name: "Freelancer Dashboard",
    description:
      "A dashboard interface for managing freelance projects, clients, and business activity.",
  },
  {
    id: "project-watch",
    name: "Luxury Watch E-Commerce",
    description:
      "An e-commerce interface for browsing and presenting premium watches.",
  },
  {
    id: "project-cookiejar",
    name: "The Cookie Jar",
    description:
      "A lightweight JavaScript application demonstrating interactive UI and client-side functionality.",
  },
];

const jobs = [
  {
    id: "job-001",
    title: "Frontend Engineer",
    companyId: "company-novastack",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$60k-$80k",
    description: "Build polished interfaces for a collaborative SaaS platform.",
  },
  {
    id: "job-002",
    title: "Full-Stack Developer",
    companyId: "company-finora",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$70k-$95k",
    description:
      "Build customer-facing financial products across frontend and backend systems.",
  },
  {
    id: "job-003",
    title: "Junior Frontend Developer",
    companyId: "company-devflow",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$50k-$70k",
    description: "Develop interfaces for developer-focused products.",
  },
  {
    id: "job-004",
    title: "AI Product Engineer",
    companyId: "company-healthbridge",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$80k-$110k",
    description:
      "Build user-facing products powered by AI and machine learning systems.",
  },
  {
    id: "job-005",
    title: "React Developer",
    companyId: "company-orbitdesk",
    location: "Remote",
    workType: "Remote",
    employmentType: "Contract",
    salaryRange: "$35-$50/hr",
    description:
      "Build responsive React interfaces for a customer operations platform.",
  },
  {
    id: "job-006",
    title: "Frontend Developer",
    companyId: "company-marketpilot",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$55k-$75k",
    description:
      "Build e-commerce analytics interfaces and customer-facing experiences.",
  },
  {
    id: "job-007",
    title: "Node.js Developer",
    companyId: "company-atlaspay",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$65k-$90k",
    description: "Build APIs and backend services for payment infrastructure.",
  },
  {
    id: "job-008",
    title: "Full-Stack Engineer",
    companyId: "company-cloudforge",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$75k-$105k",
    description:
      "Develop cloud infrastructure products across frontend and backend.",
  },
  {
    id: "job-009",
    title: "Frontend Engineer",
    companyId: "company-caresync",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$60k-$85k",
    description:
      "Build accessible healthcare interfaces used by providers and patients.",
  },
  {
    id: "job-010",
    title: "Software Engineer",
    companyId: "company-greengrid",
    location: "Remote",
    workType: "Hybrid",
    employmentType: "Full-time",
    salaryRange: "$65k-$90k",
    description:
      "Build software for monitoring and optimizing distributed energy systems.",
  },
  {
    id: "job-011",
    title: "Next.js Developer",
    companyId: "company-novastack",
    location: "Remote",
    workType: "Remote",
    employmentType: "Contract",
    salaryRange: "$40-$55/hr",
    description: "Develop high-performance web experiences using Next.js.",
  },
  {
    id: "job-012",
    title: "Web Developer",
    companyId: "company-orbitdesk",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$50k-$70k",
    description: "Build and maintain responsive web applications.",
  },
  {
    id: "job-013",
    title: "Backend Engineer",
    companyId: "company-finora",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$75k-$105k",
    description: "Build secure backend services and financial APIs.",
  },
  {
    id: "job-014",
    title: "Frontend Platform Engineer",
    companyId: "company-devflow",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$70k-$100k",
    description:
      "Build reusable frontend systems and developer-facing tooling.",
  },
  {
    id: "job-015",
    title: "AI Frontend Engineer",
    companyId: "company-healthbridge",
    location: "Remote",
    workType: "Remote",
    employmentType: "Contract",
    salaryRange: "$45-$65/hr",
    description:
      "Translate AI-powered capabilities into intuitive user experiences.",
  },
  {
    id: "job-016",
    title: "E-Commerce Frontend Developer",
    companyId: "company-marketpilot",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$55k-$78k",
    description:
      "Create high-performance shopping experiences and product interfaces.",
  },
  {
    id: "job-017",
    title: "API Integration Engineer",
    companyId: "company-atlaspay",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$60k-$85k",
    description:
      "Integrate financial APIs and build reliable application workflows.",
  },
  {
    id: "job-018",
    title: "Web Application Engineer",
    companyId: "company-caresync",
    location: "Remote",
    workType: "Remote",
    employmentType: "Full-time",
    salaryRange: "$60k-$85k",
    description: "Build responsive web applications for healthcare operations.",
  },
];

/*
 * Gaius' actual skill profile.
 *
 * Frontend: 3+ years strong.
 * Backend: approximately 5 months.
 * Python / AI: currently expanding skillset.
 */
const person = {
  id: "person-gaius",
  name: "Gaius Emmanuel",
  title: "Frontend Developer",
  location: "Nigeria",
  summary:
    "Frontend-focused developer with 3+ years of experience building responsive web applications and approximately 5 months of backend development experience. Currently expanding into Python and AI-powered systems.",
};

const personSkills = [
  {
    skillId: "skill-javascript",
    level: "advanced",
    years: 3,
  },
  {
    skillId: "skill-react",
    level: "advanced",
    years: 3,
  },
  {
    skillId: "skill-nextjs",
    level: "intermediate",
    years: 1,
  },
  {
    skillId: "skill-html",
    level: "advanced",
    years: 3,
  },
  {
    skillId: "skill-css",
    level: "advanced",
    years: 3,
  },
  {
    skillId: "skill-tailwind",
    level: "advanced",
    years: 2,
  },
  {
    skillId: "skill-responsive",
    level: "advanced",
    years: 3,
  },
  {
    skillId: "skill-uiux",
    level: "intermediate",
    years: 2,
  },
  {
    skillId: "skill-node",
    level: "beginner",
    years: 0.4,
  },
  {
    skillId: "skill-express",
    level: "beginner",
    years: 0.4,
  },
  {
    skillId: "skill-rest",
    level: "intermediate",
    years: 0.4,
  },
  {
    skillId: "skill-auth",
    level: "beginner",
    years: 0.4,
  },
  {
    skillId: "skill-postgresql",
    level: "beginner",
    years: 0.2,
  },
  {
    skillId: "skill-sql",
    level: "intermediate",
    years: 0.5,
  },
  {
    skillId: "skill-api",
    level: "intermediate",
    years: 1,
  },
  {
    skillId: "skill-git",
    level: "intermediate",
    years: 3,
  },
  {
    skillId: "skill-github",
    level: "intermediate",
    years: 3,
  },
  {
    skillId: "skill-debugging",
    level: "intermediate",
    years: 3,
  },
  {
    skillId: "skill-python",
    level: "learning",
    years: 0.2,
  },
  {
    skillId: "skill-ai",
    level: "learning",
    years: 0.2,
  },
];

const projectSkills = {
  "project-newsletter": [
    "skill-nextjs",
    "skill-react",
    "skill-javascript",
    "skill-rest",
    "skill-api",
    "skill-auth",
  ],
  "project-movue": [
    "skill-react",
    "skill-javascript",
    "skill-tailwind",
    "skill-rest",
    "skill-api",
    "skill-auth",
  ],
  "project-savora": [
    "skill-react",
    "skill-javascript",
    "skill-html",
    "skill-css",
    "skill-tailwind",
    "skill-responsive",
    "skill-uiux",
  ],
  "project-dashboard": [
    "skill-react",
    "skill-javascript",
    "skill-tailwind",
    "skill-responsive",
    "skill-uiux",
  ],
  "project-watch": [
    "skill-react",
    "skill-javascript",
    "skill-html",
    "skill-css",
    "skill-responsive",
    "skill-uiux",
  ],
  "project-cookiejar": [
    "skill-javascript",
    "skill-html",
    "skill-css",
    "skill-responsive",
  ],
};

const projectTechnologies = {
  "project-newsletter": ["tech-nextjs", "tech-react", "tech-supabase"],
  "project-movue": ["tech-react", "tech-tailwind", "tech-supabase"],
  "project-savora": ["tech-react", "tech-tailwind"],
  "project-dashboard": ["tech-react", "tech-tailwind"],
  "project-watch": ["tech-react", "tech-tailwind"],
  "project-cookiejar": [],
};

/*
 * Skills required by each job.
 *
 * "required" = core skill
 * "preferred" = useful but not mandatory
 */
const jobSkills = {
  "job-001": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-nextjs",
      "skill-css",
      "skill-git",
    ],
    preferred: ["skill-responsive", "skill-tailwind"],
  },

  "job-002": {
    required: [
      "skill-react",
      "skill-typescript",
      "skill-node",
      "skill-postgresql",
      "skill-rest",
    ],
    preferred: ["skill-nextjs", "skill-auth"],
  },

  "job-003": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-html",
      "skill-css",
      "skill-git",
    ],
    preferred: ["skill-tailwind", "skill-responsive"],
  },

  "job-004": {
    required: [
      "skill-python",
      "skill-ai",
      "skill-rest",
      "skill-react",
      "skill-postgresql",
    ],
    preferred: ["skill-nextjs", "skill-api"],
  },

  "job-005": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-css",
      "skill-responsive",
    ],
    preferred: ["skill-nextjs", "skill-tailwind", "skill-api"],
  },

  "job-006": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-html",
      "skill-css",
      "skill-responsive",
    ],
    preferred: ["skill-uiux", "skill-api"],
  },

  "job-007": {
    required: [
      "skill-node",
      "skill-express",
      "skill-rest",
      "skill-postgresql",
      "skill-git",
    ],
    preferred: ["skill-auth", "skill-api"],
  },

  "job-008": {
    required: [
      "skill-react",
      "skill-node",
      "skill-rest",
      "skill-postgresql",
      "skill-git",
    ],
    preferred: ["skill-nextjs", "skill-api"],
  },

  "job-009": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-html",
      "skill-css",
      "skill-responsive",
    ],
    preferred: ["skill-uiux", "skill-tailwind"],
  },

  "job-010": {
    required: ["skill-javascript", "skill-react", "skill-rest", "skill-api"],
    preferred: ["skill-python", "skill-postgresql", "skill-nextjs"],
  },

  "job-011": {
    required: ["skill-nextjs", "skill-react", "skill-javascript", "skill-css"],
    preferred: ["skill-tailwind", "skill-responsive"],
  },

  "job-012": {
    required: [
      "skill-html",
      "skill-css",
      "skill-javascript",
      "skill-responsive",
    ],
    preferred: ["skill-react", "skill-git"],
  },

  "job-013": {
    required: [
      "skill-node",
      "skill-express",
      "skill-postgresql",
      "skill-rest",
      "skill-auth",
    ],
    preferred: ["skill-sql", "skill-api"],
  },

  "job-014": {
    required: ["skill-javascript", "skill-react", "skill-nextjs", "skill-git"],
    preferred: ["skill-tailwind", "skill-debugging"],
  },

  "job-015": {
    required: ["skill-react", "skill-javascript", "skill-ai", "skill-rest"],
    preferred: ["skill-nextjs", "skill-python"],
  },

  "job-016": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-css",
      "skill-responsive",
    ],
    preferred: ["skill-tailwind", "skill-uiux"],
  },

  "job-017": {
    required: ["skill-javascript", "skill-rest", "skill-api"],
    preferred: ["skill-node", "skill-postgresql", "skill-auth"],
  },

  "job-018": {
    required: [
      "skill-react",
      "skill-javascript",
      "skill-html",
      "skill-css",
      "skill-rest",
    ],
    preferred: ["skill-nextjs", "skill-api", "skill-responsive"],
  },
};

/*
 * Skill relationships.
 *
 * These are deliberately directional because they allow us to
 * traverse the skill ecosystem when calculating related matches.
 */
const relatedSkills = [
  ["skill-javascript", "skill-typescript"],
  ["skill-javascript", "skill-react"],
  ["skill-javascript", "skill-node"],
  ["skill-javascript", "skill-nextjs"],
  ["skill-react", "skill-nextjs"],
  ["skill-react", "skill-uiux"],
  ["skill-react", "skill-responsive"],
  ["skill-node", "skill-express"],
  ["skill-node", "skill-rest"],
  ["skill-rest", "skill-api"],
  ["skill-postgresql", "skill-sql"],
  ["skill-python", "skill-ai"],
  ["skill-ai", "skill-api"],
  ["skill-html", "skill-css"],
  ["skill-css", "skill-responsive"],
  ["skill-tailwind", "skill-responsive"],
  ["skill-git", "skill-github"],
];

/*
 * Helper functions
 */

async function createConstraints(tx) {
  const constraints = [
    "CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
    "CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT technology_id IF NOT EXISTS FOR (t:Technology) REQUIRE t.id IS UNIQUE",
    "CREATE CONSTRAINT job_id IF NOT EXISTS FOR (j:Job) REQUIRE j.id IS UNIQUE",
    "CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE",
    "CREATE CONSTRAINT industry_id IF NOT EXISTS FOR (i:Industry) REQUIRE i.id IS UNIQUE",
  ];

  for (const query of constraints) {
    await tx.run(query);
  }
}

async function seedIndustries(tx) {
  await tx.run(
    `
    UNWIND $industries AS industry
    MERGE (i:Industry {id: industry.id})
    SET i.name = industry.name
    `,
    { industries },
  );
}

async function seedTechnologies(tx) {
  await tx.run(
    `
    UNWIND $technologies AS technology
    MERGE (t:Technology {id: technology.id})
    SET t.name = technology.name
    `,
    { technologies },
  );
}

async function seedSkills(tx) {
  await tx.run(
    `
    UNWIND $skills AS skill
    MERGE (s:Skill {id: skill.id})
    SET
      s.name = skill.name,
      s.category = skill.category
    `,
    { skills },
  );
}

async function seedPerson(tx) {
  await tx.run(
    `
    MERGE (p:Person {id: $id})
    SET
      p.name = $name,
      p.title = $title,
      p.location = $location,
      p.summary = $summary
    `,
    person,
  );

  await tx.run(
    `
    MATCH (p:Person {id: $personId})
    UNWIND $skills AS skill
    MATCH (s:Skill {id: skill.skillId})
    MERGE (p)-[r:HAS_SKILL]->(s)
    SET
      r.level = skill.level,
      r.years = skill.years
    `,
    {
      personId: person.id,
      skills: personSkills,
    },
  );
}

async function seedProjects(tx) {
  await tx.run(
    `
    UNWIND $projects AS project
    MERGE (p:Project {id: project.id})
    SET
      p.name = project.name,
      p.description = project.description
    `,
    { projects },
  );

  for (const [projectId, skillIds] of Object.entries(projectSkills)) {
    await tx.run(
      `
      MATCH (p:Project {id: $projectId})
      UNWIND $skillIds AS skillId
      MATCH (s:Skill {id: skillId})
      MERGE (p)-[:DEMONSTRATES]->(s)
      `,
      { projectId, skillIds },
    );
  }

  for (const [projectId, technologyIds] of Object.entries(
    projectTechnologies,
  )) {
    if (!technologyIds.length) continue;

    await tx.run(
      `
      MATCH (p:Project {id: $projectId})
      UNWIND $technologyIds AS technologyId
      MATCH (t:Technology {id: technologyId})
      MERGE (p)-[:USES]->(t)
      `,
      { projectId, technologyIds },
    );
  }

  await tx.run(
    `
    MATCH (p:Person {id: $personId})
    MATCH (project:Project)
    WHERE project.id IN $projectIds
    MERGE (p)-[:BUILT]->(project)
    `,
    {
      personId: person.id,
      projectIds: projects.map((project) => project.id),
    },
  );
}

async function seedCompanies(tx) {
  await tx.run(
    `
    UNWIND $companies AS company
    MERGE (c:Company {id: company.id})
    SET
      c.name = company.name,
      c.description = company.description
    WITH c, company
    MATCH (i:Industry {id: company.industryId})
    MERGE (c)-[:OPERATES_IN]->(i)
    `,
    { companies },
  );
}

async function seedJobs(tx) {
  await tx.run(
    `
    UNWIND $jobs AS job
    MERGE (j:Job {id: job.id})
    SET
      j.title = job.title,
      j.location = job.location,
      j.workType = job.workType,
      j.employmentType = job.employmentType,
      j.salaryRange = job.salaryRange,
      j.description = job.description
    WITH j, job
    MATCH (c:Company {id: job.companyId})
    MERGE (c)-[:OFFERS]->(j)
    `,
    { jobs },
  );

  for (const [jobId, requirements] of Object.entries(jobSkills)) {
    if (requirements.required?.length) {
      await tx.run(
        `
        MATCH (j:Job {id: $jobId})
        UNWIND $skillIds AS skillId
        MATCH (s:Skill {id: skillId})
        MERGE (j)-[r:REQUIRES]->(s)
        SET r.importance = "required"
        `,
        {
          jobId,
          skillIds: requirements.required,
        },
      );
    }

    if (requirements.preferred?.length) {
      await tx.run(
        `
        MATCH (j:Job {id: $jobId})
        UNWIND $skillIds AS skillId
        MATCH (s:Skill {id: skillId})
        MERGE (j)-[r:PREFERS]->(s)
        SET r.importance = "preferred"
        `,
        {
          jobId,
          skillIds: requirements.preferred,
        },
      );
    }
  }
}

async function seedSkillRelationships(tx) {
  for (const [fromId, toId] of relatedSkills) {
    await tx.run(
      `
      MATCH (a:Skill {id: $fromId})
      MATCH (b:Skill {id: $toId})
      MERGE (a)-[:RELATED_TO]->(b)
      `,
      { fromId, toId },
    );
  }
}

async function verifySeed(tx) {
  const result = await tx.run(`
    MATCH (n)
    RETURN labels(n)[0] AS type, count(n) AS count
    ORDER BY type
  `);

  console.log("\nNode counts:");

  for (const record of result.records) {
    console.log(`  ${record.get("type")}: ${record.get("count").toString()}`);
  }

  const relationships = await tx.run(`
    MATCH ()-[r]->()
    RETURN type(r) AS type, count(r) AS count
    ORDER BY type
  `);

  console.log("\nRelationship counts:");

  for (const record of relationships.records) {
    console.log(`  ${record.get("type")}: ${record.get("count").toString()}`);
  }
}

/*
 * Main
 */

async function main() {
  const tx = session.beginTransaction();

  try {
    console.log("Creating constraints...");
    await createConstraints(tx);

    console.log("Seeding industries...");
    await seedIndustries(tx);

    console.log("Seeding technologies...");
    await seedTechnologies(tx);

    console.log("Seeding skills...");
    await seedSkills(tx);

    console.log("Seeding person and skills...");
    await seedPerson(tx);

    console.log("Seeding projects...");
    await seedProjects(tx);

    console.log("Seeding companies...");
    await seedCompanies(tx);

    console.log("Seeding jobs...");
    await seedJobs(tx);

    console.log("Seeding skill relationships...");
    await seedSkillRelationships(tx);

    await tx.commit();

    console.log("\nSeed completed successfully.");

    await verifySeed(session);
  } catch (error) {
    await tx.rollback();

    console.error("\nSeed failed:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
