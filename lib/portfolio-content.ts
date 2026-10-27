import {
  education,
  focusAreas,
  projects as fallbackProjects,
  quickStats,
  skillGroups,
  type Project
} from "@/data/portfolio";

export type SiteContent = {
  homepageEyebrow: string;
  homepageTitle: string;
  homepageIntro: string;
  heroImage: string;
  heroImageCaption: string;
  aboutTitle: string;
  aboutBody1: string;
  aboutBody2: string;
  projectsTitle: string;
  skillsTitle: string;
  educationTitle: string;
  contactTitle: string;
  contactEmail: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  footerText: string;
};

export type StructuredSiteContent = {
  focusAreas: string[];
  quickStats: Array<{ label: string; value: string }>;
  skillGroups: Array<{ title: string; skills: string[] }>;
  education: Array<{ school: string; degree: string; period: string; coursework: string[] }>;
};

export type PublicPortfolioData = {
  siteContent: SiteContent;
  projects: Project[];
  education: typeof education;
  focusAreas: typeof focusAreas;
  quickStats: typeof quickStats;
  skillGroups: typeof skillGroups;
};

export type SiteContentRow = {
  section: string;
  key: string;
  value: string | null;
};

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  year: string | null;
  category: string | null;
  tags: string[] | null;
  tech_stack: string[] | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  project_url: string | null;
  featured: boolean | null;
  visible: boolean | null;
  sort_order: number | null;
  problem: string | null;
  dataset: string | null;
  approach: string | null;
  models: string | null;
  evaluation: string | null;
  results: string | null;
  learned: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  status: "new" | "contacted" | "archived";
  created_at: string;
};

const heroPhotoUrl = "/jiawen-profile.png";

export const defaultSiteContent: SiteContent = {
  homepageEyebrow: "Jiawen (Jarvan) Wang",
  homepageTitle: "Data Analytics / Machine Learning",
  homepageIntro:
    "Master of Information Technology student at UTS focused on data analytics and applied machine learning. I use Python, SQL, Pandas, and scikit-learn to prepare data, explore patterns, and build reproducible predictive workflows.",
  heroImage: heroPhotoUrl,
  heroImageCaption: "Jiawen Wang with a kitten",
  aboutTitle: "Turning complex data into clear analysis and practical models.",
  aboutBody1:
    "I am currently studying the Master of Information Technology at the University of Technology Sydney, focusing on data analytics and applied machine learning. My biotechnology background also gives me a useful foundation for working with healthcare and scientific data.",
  aboutBody2:
    "I enjoy the full data workflow: cleaning and exploring data, engineering useful features, evaluating models, and communicating results clearly enough to support the next decision.",
  projectsTitle: "Data analytics and machine learning projects.",
  skillsTitle: "Data analysis, modelling, and the tools behind the workflow.",
  educationTitle: "Combining data and technology training with a foundation in biotechnology.",
  contactTitle: "Let's connect about data analytics and applied machine learning.",
  contactEmail: "jiawen.wang1117@gmail.com",
  location: "Sydney, Australia",
  githubUrl: "https://github.com/Jarvan-1117",
  linkedinUrl: "https://www.linkedin.com/in/jiawen-wang1117/",
  instagramUrl: "",
  footerText: "Jiawen (Jarvan) Wang. Built with Next.js, TypeScript, and Tailwind CSS."
};

export const defaultStructuredContent: StructuredSiteContent = {
  focusAreas: [...focusAreas],
  quickStats: quickStats.map(({ label, value }) => ({ label, value })),
  skillGroups: skillGroups.map(({ title, skills }) => ({ title, skills: [...skills] })),
  education: education.map((item) => ({ ...item, coursework: [...item.coursework] }))
};

const projectPriority = [
  "CricSee: T20 Cricket Analytics",
  "Australian Trade & Petroleum Analytics",
  "Wimbledon Finals & Player Performance",
  "Cardiovascular Disease Prediction",
  "SMS Spam Classification",
  "Handwritten Mathematical Symbol Recognition",
  "Deep Learning for Image Classification & Object Detection",
  "Smart Retail Checkout System",
  "Hybrid Sparse-Dense Retrieval for RAG",
  "Kitty & Puppy Park"
];

export const defaultPortfolioData: PublicPortfolioData = {
  siteContent: defaultSiteContent,
  projects: [...fallbackProjects].sort((a, b) => projectPriority.indexOf(a.title) - projectPriority.indexOf(b.title)).map((project, index) => ({
    ...project,
    slug: project.slug || slugify(project.title),
    visible: true,
    featured: index === 0,
    sort_order: index
  })),
  education,
  focusAreas,
  quickStats,
  skillGroups
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function supabaseHeaders(token?: string) {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token ?? anonKey}`,
    "Content-Type": "application/json"
  };
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(token),
      Prefer: "return=representation",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

export function contentRowsToMap(rows: SiteContentRow[]) {
  const content = { ...defaultSiteContent };
  rows.forEach((row) => {
    const key = row.key as keyof SiteContent;
    if (key in content && typeof row.value === "string") content[key] = row.value;
  });
  return content;
}

export function structuredContentFromRows(rows: SiteContentRow[]): StructuredSiteContent {
  const values = new Map(rows.map((row) => [row.key, row.value]));
  return {
    focusAreas: parseStructuredValue(values.get("focusAreas"), defaultStructuredContent.focusAreas),
    quickStats: parseStructuredValue(values.get("quickStats"), defaultStructuredContent.quickStats),
    skillGroups: parseStructuredValue(values.get("skillGroups"), defaultStructuredContent.skillGroups),
    education: parseStructuredValue(values.get("education"), defaultStructuredContent.education)
  };
}

function parseStructuredValue<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function projectRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.description ?? "",
    description: row.description ?? "",
    long_description: row.long_description ?? "",
    year: row.year ?? "",
    category: row.category ?? "",
    cover_image: row.cover_image ?? "",
    gallery_images: row.gallery_images ?? [],
    project_url: row.project_url ?? "",
    featured: Boolean(row.featured),
    visible: row.visible !== false,
    sort_order: row.sort_order ?? 0,
    techStack: row.tech_stack ?? [],
    tags: row.tags ?? [],
    icon: pickProjectIcon(row.category, row.tags ?? []),
    caseStudy: {
      problem: row.problem ?? row.long_description ?? "",
      dataset: row.dataset ?? "",
      approach: row.approach ?? "",
      models: row.models ?? "",
      evaluation: row.evaluation ?? "",
      results: row.results ?? "",
      learned: row.learned ?? ""
    }
  };
}

function pickProjectIcon(category: string | null, tags: string[]) {
  const text = `${category ?? ""} ${tags.join(" ")}`.toLowerCase();
  if (text.includes("nlp") || text.includes("text") || text.includes("language")) return "nlp";
  if (text.includes("health") || text.includes("medical")) return "healthcare";
  if (text.includes("symbol") || text.includes("math")) return "symbols";
  return "vision";
}

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  // Public pages use local content independently of the retired Supabase CMS.
  return defaultPortfolioData;
}

export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  return defaultPortfolioData.projects.find((project) => project.slug === slug) ?? null;
}
