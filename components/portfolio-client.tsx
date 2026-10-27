"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type React from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Pause,
  PawPrint,
  Play,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BorderGlow from "@/components/border-glow";
import Galaxy from "@/components/galaxy";
import SwarmCursor from "@/components/swarm-cursor";
import { useEntranceActive } from "@/components/portfolio-entrance";
import { PortfolioSceneToggle, PortfolioVideoBackground, usePortfolioScene } from "@/components/portfolio-scene";
import { PortfolioAudioToggle } from "@/components/portfolio-audio";
import { type Project } from "@/data/portfolio";
import { defaultPortfolioData, type PublicPortfolioData } from "@/lib/portfolio-content";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" }
];

const defaultNavGlowProps = {
  edgeSensitivity: 22,
  glowColor: "184 82 74",
  backgroundColor: "#071012",
  borderRadius: 8,
  glowRadius: 18,
  glowIntensity: 0.72,
  coneSpread: 22,
  colors: ["#9ee7e5", "#38bdf8", "#0f8b8d"],
  fillOpacity: 0.12
};

function SectionLabel({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className={clsx("section-heading max-w-3xl", compact ? "mb-5" : "mb-8")}>
      <p className={clsx("section-eyebrow font-semibold uppercase tracking-[0.18em] text-accent dark:text-[#69d6d4]", compact ? "mb-2 text-xs" : "mb-3 text-sm")}>
        {eyebrow}
      </p>
      <h2 className={clsx("section-title font-semibold tracking-normal text-neutral-950 dark:text-white", compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl")}>
        {title}
      </h2>
    </div>
  );
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroPhoto({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-soft md:max-w-[500px]">
      <img
        src={src}
        alt={caption}
        className="h-full w-full object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071012]/62 via-transparent to-[#071012]/12" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function Navigation({ githubUrl, linkedinUrl }: { githubUrl: string; linkedinUrl: string }) {
  const scene = usePortfolioScene();
  const navGlowProps = scene ? {
    ...defaultNavGlowProps,
    backgroundColor: "var(--scene-control-bg)",
    glowColor: scene.mode === "day" ? "31 40 65" : "35 50 65",
    colors: scene.mode === "day" ? ["#bc8250", "#d7a070", "#e4bda4"] : ["#d8b58e", "#bd9272", "#bdaea0"],
    glowIntensity: 0.3,
    fillOpacity: 0.06
  } : defaultNavGlowProps;
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const targets = ["home", "about", "projects", "skills", "education", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );
    targets.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="portfolio-nav fixed inset-x-0 top-0 z-50 border-b border-neutral-200/75 bg-neutral-50/86 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1115]/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <a href="#top" className="portfolio-brand focus-ring inline-flex items-center gap-2 rounded text-sm font-semibold tracking-normal">
          {scene && <PawPrint className="brand-paw h-4 w-4" aria-hidden="true" />}
          Jiawen Wang
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <BorderGlow key={item.label} className="nav-text-glow w-24" {...navGlowProps}>
              <a
                href={item.href}
                aria-current={active === item.href.replace("#", "") ? "location" : undefined}
                target={item.href === "/resume.pdf" ? "_blank" : undefined}
                rel={item.href === "/resume.pdf" ? "noreferrer" : undefined}
                className={clsx(
                  "portfolio-nav-link focus-ring flex h-10 w-full items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
                  active === item.href.replace("#", "")
                    ? "bg-accent-soft text-accent-dark dark:bg-accent/20 dark:text-[#9ee7e5]"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                )}
              >
                {item.label}
              </a>
            </BorderGlow>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {scene && (
            <>
              <BorderGlow {...navGlowProps}>
                <PortfolioAudioToggle className="rounded-md p-2 text-neutral-300 transition hover:text-white" />
              </BorderGlow>
              <BorderGlow {...navGlowProps}>
                <PortfolioSceneToggle />
              </BorderGlow>
              <BorderGlow {...navGlowProps}>
                <button type="button" className="scene-control focus-ring rounded-md p-2 text-neutral-300 transition hover:text-white" onClick={scene.togglePaused} aria-label={scene.paused ? "Play background video" : "Pause background video"} title={scene.paused ? "Play background video" : "Pause background video"}>
                  {scene.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>
              </BorderGlow>
            </>
          )}
          <BorderGlow className="hidden sm:grid" {...navGlowProps}>
            <a className="focus-ring rounded-md p-2 text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github className="h-5 w-5" />
            </a>
          </BorderGlow>
          <BorderGlow className="hidden sm:grid" {...navGlowProps}>
            <a className="focus-ring rounded-md p-2 text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <Linkedin className="h-5 w-5" />
            </a>
          </BorderGlow>
          <BorderGlow className="hidden sm:grid" {...navGlowProps}>
            <a className="theme-button theme-button--primary focus-ring rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark dark:bg-white dark:text-neutral-950 dark:hover:bg-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </BorderGlow>
          <BorderGlow className="lg:hidden" {...navGlowProps}>
            <button className="focus-ring rounded-md p-2 text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </BorderGlow>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="portfolio-mobile-menu border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-white/10 dark:bg-[#0f1115] lg:hidden"
          >
            {navItems.map((item) => (
              <a key={item.label} href={item.href} target={item.href === "/resume.pdf" ? "_blank" : undefined} rel={item.href === "/resume.pdf" ? "noreferrer" : undefined} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/5">
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <FadeIn className={clsx("h-full", className)}>
      <a href={project.slug ? `/projects/${project.slug}` : undefined} aria-label={project.title} title={project.title} className="portfolio-project focus-ring group relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-glow dark:border-white/10 dark:bg-white/[0.04]">
        <div className="project-rule absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-neutral-400 to-transparent opacity-80" />
        {project.category || project.year ? (
          <p className="project-meta mb-1.5 text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">
            {[project.category, project.year].filter(Boolean).join(" / ")}
          </p>
        ) : null}
        <h3 className="project-title line-clamp-2 text-base font-semibold leading-snug text-neutral-950 dark:text-white">{project.title}</h3>
        {project.cover_image ? (
          <img src={project.cover_image} alt="" className="mt-2.5 h-24 w-full rounded-md object-cover opacity-90 xl:h-28" />
        ) : null}
        <p className="project-summary mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-neutral-600 dark:text-neutral-300">{project.summary}</p>
      </a>
    </FadeIn>
  );
}

export default function PortfolioClient({ initialData = defaultPortfolioData, cinematic = false }: { initialData?: PublicPortfolioData; cinematic?: boolean }) {
  const entranceActive = useEntranceActive();
  const scene = usePortfolioScene();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const year = useMemo(() => new Date().getFullYear(), []);
  const { siteContent, projects, education, focusAreas, quickStats, skillGroups } = initialData;
  const email = siteContent.contactEmail;
  const githubUrl = siteContent.githubUrl;
  const linkedinUrl = siteContent.linkedinUrl;
  const hasEmail = Boolean(email && !email.toLowerCase().includes("example.com"));

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), copyStatus === "copied" ? 1800 : 6000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <>
      {cinematic && <PortfolioVideoBackground active={!entranceActive} />}
      {!cinematic && !entranceActive && <Galaxy
        className="galaxy-backdrop"
        density={0.72}
        glowIntensity={0.34}
        saturation={0.13}
        hueShift={252}
        repulsionStrength={1}
        speed={0.18}
        starSpeed={0.26}
        twinkleIntensity={0.1}
        mouseRepulsion
        mouseInteraction
        transparent
      />}
      {!cinematic && <div className="noise" />}
      {!entranceActive && <SwarmCursor
        color={scene?.mode === "day" ? "#b58059" : "#cbb28e"}
        accentColor={scene?.mode === "day" ? "#dfb390" : "#f0dec3"}
        count={6}
        size={4.5}
        merge={0.68}
        speed={1.95}
        spread={72}
        wander={0.18}
        trail={0.86}
        glow={0.72}
        opacity={0.5}
        scatterOnClick
      />}
      <Navigation githubUrl={githubUrl} linkedinUrl={linkedinUrl} />
      <main id="top" className="relative z-10">
        <section id="home" className={clsx("flex min-h-screen items-center px-4 pb-16 pt-24 sm:px-6 md:pb-20 md:pt-28 lg:px-8", cinematic ? "cinematic-hero" : "site-grid")}>
          <div className="cinematic-hero__content mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <FadeIn>
              <p className="hero-eyebrow mb-4 inline-flex rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-dark dark:bg-accent/15 dark:text-[#9ee7e5]">
                {siteContent.homepageEyebrow}
              </p>
              <h1 className="hero-title max-w-3xl text-5xl font-semibold tracking-normal text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
                {siteContent.homepageTitle}
              </h1>
              <p className="hero-copy mt-6 max-w-2xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                {siteContent.homepageIntro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="theme-button theme-button--primary focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark dark:bg-white dark:text-neutral-950 dark:hover:bg-[#9ee7e5]" href="#projects">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a className="theme-button theme-button--secondary focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white/80 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-accent hover:text-accent-dark dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:text-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
                  Download Resume
                  <Download className="h-4 w-4" />
                </a>
              </div>
              <a className="hero-social focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-neutral-600 transition hover:text-accent-dark dark:text-neutral-300 dark:hover:text-[#9ee7e5]" href={githubUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                github.com/Jarvan-1117
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a className="hero-social focus-ring mt-3 inline-flex items-center gap-2 rounded-md text-sm font-medium text-neutral-600 transition hover:text-accent-dark dark:text-neutral-300 dark:hover:text-[#9ee7e5]" href={linkedinUrl} target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                linkedin.com/in/jiawen-wang1117
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </FadeIn>
            {!cinematic && (
              <FadeIn>
                <HeroPhoto src={siteContent.heroImage} caption={siteContent.heroImageCaption} />
              </FadeIn>
            )}
          </div>
        </section>

        <section id="about" className="flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="About" title={siteContent.aboutTitle} />
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <FadeIn className="about-copy space-y-5 text-base leading-8 text-neutral-700 dark:text-neutral-300">
                <p>{siteContent.aboutBody1}</p>
                <p>{siteContent.aboutBody2}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {focusAreas.map((area) => (
                    <span key={area} className="theme-tag rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200">
                      {area}
                    </span>
                  ))}
                </div>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickStats.map((stat) => (
                  <FadeIn key={stat.label}>
                    <div className="portfolio-stat rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                      <stat.icon className="mb-5 h-5 w-5 text-accent dark:text-[#69d6d4]" />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                      <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">{stat.value}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" aria-label="Selected projects" className="flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center border-y border-neutral-200 bg-white/60 px-4 py-10 dark:border-white/10 dark:bg-white/[0.025] sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="Selected Projects" title={siteContent.projectsTitle} compact />
            <div id="project-grid" className={clsx("project-grid grid gap-3 md:grid-cols-2", projects.length === 10 ? "lg:grid-cols-12" : "lg:grid-cols-3")}>
              {projects.map((project, index) => (
                <ProjectCard key={project.slug || project.title} project={project} className={projects.length === 10 ? index < 4 ? "lg:col-span-3" : "lg:col-span-4" : undefined} />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="Skills" title={siteContent.skillsTitle} />
            <div className="grid gap-5 md:grid-cols-2">
              {skillGroups.map((group) => (
                <FadeIn key={group.title}>
                  <div className="portfolio-skill h-full rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="skill-icon flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent-dark dark:bg-accent/20 dark:text-[#9ee7e5]">
                        <group.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">{group.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span key={skill} className="theme-tag rounded-md bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-white/[0.07] dark:text-neutral-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center border-y border-neutral-200 bg-white/60 px-4 py-20 dark:border-white/10 dark:bg-white/[0.025] sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="Education" title={siteContent.educationTitle} />
            <div className="education-timeline relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-neutral-200 dark:before:bg-white/10">
              {education.map((item) => (
                <FadeIn key={item.school}>
                  <article className="relative pl-12">
                    <div className="education-dot absolute left-[9px] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-white dark:ring-[#111318]" />
                    <div className="portfolio-education rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">{item.school}</h3>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.degree}</p>
                        </div>
                        <span className="education-period text-sm font-medium text-accent-dark dark:text-[#9ee7e5]">{item.period}</span>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.coursework.map((course) => (
                          <span key={course} className="theme-tag rounded-md bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-white/[0.07] dark:text-neutral-200">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto w-full max-w-6xl">
            <div className="portfolio-contact grid gap-8 rounded-lg border border-neutral-200 bg-neutral-950 p-6 text-white shadow-soft dark:border-white/10 dark:bg-white/[0.05] md:grid-cols-[0.72fr_1.28fr] md:p-8">
              <div>
                <p className="section-eyebrow mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#9ee7e5]">Contact</p>
                <h2 className="section-title text-2xl font-semibold md:text-3xl">{siteContent.contactTitle}</h2>
                <div className="contact-links mt-5 flex flex-wrap gap-4 text-sm text-neutral-300">
                  <a className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white" href={githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {siteContent.location}
                  </span>
                </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row md:flex-col">
                <a className="theme-button theme-button--secondary focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#9ee7e5] hover:text-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
              </div>
              <div className="portfolio-contact-methods min-w-0 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                {hasEmail && (
                  <>
                    <h3 className="text-sm font-medium">Email</h3>
                    <a className="contact-email focus-ring mt-3 inline-block max-w-full select-all break-all rounded text-xl font-semibold sm:text-2xl" href={`mailto:${email}`}>
                      {email}
                    </a>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a className="theme-button theme-button--primary focus-ring inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold" href={`mailto:${email}`}>
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        Email Me
                      </a>
                      <button type="button" className="theme-button focus-ring inline-flex min-w-36 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold" onClick={copyEmail}>
                        {copyStatus === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        {copyStatus === "copied" ? "Copied" : "Copy Email"}
                      </button>
                    </div>
                    <p className="contact-copy-status mt-3 min-h-5 text-sm" role="status" aria-live="polite">
                      {copyStatus === "copied" ? "Email address copied." : copyStatus === "error" ? "Unable to copy. Please select and copy the email address above." : ""}
                    </p>
                  </>
                )}
                <a className="theme-button focus-ring mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold" href={linkedinUrl} target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  LinkedIn
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
      <footer className="portfolio-footer relative z-10 border-t border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
        Copyright {year} {siteContent.footerText}
        {cinematic && (
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            Music: <a className="focus-ring underline underline-offset-2 hover:text-white" href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1200076" target="_blank" rel="noreferrer">Easy Lemon by Kevin MacLeod</a>
            {" · "}<a className="focus-ring underline underline-offset-2 hover:text-white" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
          </p>
        )}
      </footer>
    </>
  );
}
