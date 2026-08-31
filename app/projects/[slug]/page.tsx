import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getPublicProjectBySlug } from "@/lib/portfolio-content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    return {
      title: "Project not found | Jiawen Wang"
    };
  }

  return {
    title: `${project.title} | Jiawen Wang`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Jiawen Wang`,
      description: project.summary,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Jiawen Wang`,
      description: project.summary,
      images: project.cover_image ? [project.cover_image] : undefined
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const rows = [
    ["Problem", project.caseStudy.problem],
    ["Dataset", project.caseStudy.dataset],
    ["Approach", project.caseStudy.approach],
    ["Models", project.caseStudy.models],
    ["Evaluation", project.caseStudy.evaluation],
    ["Results", project.caseStudy.results],
    ["What I Learned", project.caseStudy.learned]
  ].filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-[#0f1115] px-4 py-24 text-neutral-100 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <Link className="mb-10 inline-flex rounded-md text-sm font-medium text-[#9ee7e5] hover:text-white" href="/#projects">
          Back to projects
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#69d6d4]">
              {project.category || "Project"} {project.year ? ` / ${project.year}` : ""}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-white md:text-6xl">{project.title}</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-300">{project.long_description || project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-white/[0.07] px-3 py-1.5 text-sm text-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.project_url ? (
                <a className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#9ee7e5]" href={project.project_url} target="_blank" rel="noreferrer">
                  Open Project
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
          {project.cover_image ? (
            <img className="aspect-[4/3] w-full rounded-lg border border-white/10 object-cover shadow-soft" src={project.cover_image} alt={`${project.title} cover`} />
          ) : null}
        </div>
        {rows.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {rows.map(([label, value]) => (
              <section key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#69d6d4]">{label}</h2>
                <p className="text-sm leading-6 text-neutral-300">{value}</p>
              </section>
            ))}
          </div>
        ) : null}
        {project.gallery_images?.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {project.gallery_images.map((image) => (
              <img key={image} className="aspect-[16/10] w-full rounded-lg border border-white/10 bg-white object-contain" src={image} alt={`${project.title} project image`} />
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
