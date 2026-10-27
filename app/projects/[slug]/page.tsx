import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { getPublicProjectBySlug } from "@/lib/portfolio-content";
import PortfolioSceneProvider, { PortfolioSceneToggle } from "@/components/portfolio-scene";
import ProjectGallery from "@/components/project-gallery";

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

  const previewImage = project.cover_image || project.video?.poster || project.figures?.[0]?.src;

  return {
    title: `${project.title} | Jiawen Wang`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Jiawen Wang`,
      description: project.summary,
      images: previewImage ? [{ url: previewImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Jiawen Wang`,
      description: project.summary,
      images: previewImage ? [previewImage] : undefined
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const rows = [
    ["Problem", project.caseStudy.problem],
    ["Gameplay", project.caseStudy.gameplay],
    ["Dataset", project.caseStudy.dataset],
    ["Approach", project.caseStudy.approach],
    ["Models", project.caseStudy.models],
    ["Evaluation", project.caseStudy.evaluation],
    ["Results", project.caseStudy.results],
    ["Prototype", project.caseStudy.prototype],
    ["Verification", project.caseStudy.verification],
    ["My Contribution", project.caseStudy.contribution],
    ["Asset Credits", project.caseStudy.credits],
    ["What I Learned", project.caseStudy.learned],
    ["Limitations", project.caseStudy.limitations]
  ].filter(([, value]) => value);

  return (
    <PortfolioSceneProvider restoreMode>
    <main className="portfolio-detail min-h-screen bg-[#0f1115] px-4 py-24 text-neutral-100 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between gap-4">
        <Link className="detail-back focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#9ee7e5] hover:text-white" href="/#projects">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to projects
        </Link>
        <div className="detail-mode-control"><PortfolioSceneToggle /></div>
        </div>
        <div className={clsx("grid gap-8", project.cover_image && "lg:grid-cols-[1fr_0.78fr] lg:items-start")}>
          <div>
            <p className="detail-category mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#69d6d4]">
              {project.category || "Project"} {project.year ? ` / ${project.year}` : ""}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-white md:text-6xl">{project.title}</h1>
            <p className="detail-summary mt-6 text-lg leading-8 text-neutral-300">{project.long_description || project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="detail-tag rounded-md bg-white/[0.07] px-3 py-1.5 text-sm text-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.project_url ? (
                <a className="theme-button theme-button--primary focus-ring inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#9ee7e5]" href={project.project_url} target="_blank" rel="noreferrer">
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
        {project.video && (
          <section className="project-demo mt-10" aria-labelledby="project-demo-title">
            <h2 id="project-demo-title" className="gallery-title mb-3 text-base font-semibold">{project.video.title}</h2>
            <video className="project-demo-video block aspect-video w-full rounded-md border bg-black object-contain" controls playsInline muted preload="metadata" poster={project.video.poster} aria-label={project.video.title} aria-describedby="project-demo-caption">
              <source src={project.video.src} type="video/mp4" />
              Your browser does not support this video. <a href={project.video.src}>Open gameplay video</a>.
            </video>
            <p id="project-demo-caption" className="gallery-caption mt-3 text-sm leading-6">{project.video.description}</p>
          </section>
        )}
        {project.figures?.length ? <ProjectGallery figures={project.figures} /> : null}
        {rows.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {rows.map(([label, value]) => (
              <section key={label} className="detail-case rounded-lg border border-white/10 bg-white/[0.04] p-5">
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
    </PortfolioSceneProvider>
  );
}
