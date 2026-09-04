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
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  Send,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BorderGlow from "@/components/border-glow";
import Galaxy from "@/components/galaxy";
import SwarmCursor from "@/components/swarm-cursor";
import { type Project } from "@/data/portfolio";
import { defaultPortfolioData, getPublicPortfolioData, type PublicPortfolioData } from "@/lib/portfolio-content";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" }
];

const navGlowProps = {
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
    <div className={clsx("max-w-3xl", compact ? "mb-5" : "mb-8")}>
      <p className={clsx("font-semibold uppercase tracking-[0.18em] text-accent dark:text-[#69d6d4]", compact ? "mb-2 text-xs" : "mb-3 text-sm")}>
        {eyebrow}
      </p>
      <h2 className={clsx("font-semibold tracking-normal text-neutral-950 dark:text-white", compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl")}>
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
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const targets = ["about", "projects", "skills", "education", "contact"];
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/75 bg-neutral-50/86 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1115]/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <a href="#top" className="focus-ring rounded text-sm font-semibold tracking-normal">
          Jiawen Wang
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <BorderGlow key={item.label} className="nav-text-glow w-24" {...navGlowProps}>
              <a
                href={item.href}
                target={item.href === "/resume.pdf" ? "_blank" : undefined}
                rel={item.href === "/resume.pdf" ? "noreferrer" : undefined}
                className={clsx(
                  "focus-ring flex h-10 w-full items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
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
          <BorderGlow {...navGlowProps}>
            <a className="focus-ring rounded-md p-2 text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github className="h-5 w-5" />
            </a>
          </BorderGlow>
          <BorderGlow {...navGlowProps}>
            <a className="focus-ring rounded-md p-2 text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <Linkedin className="h-5 w-5" />
            </a>
          </BorderGlow>
          <BorderGlow className="hidden sm:grid" {...navGlowProps}>
            <a className="focus-ring rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark dark:bg-white dark:text-neutral-950 dark:hover:bg-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </BorderGlow>
          <BorderGlow className="md:hidden" {...navGlowProps}>
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
            className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-white/10 dark:bg-[#0f1115] md:hidden"
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

function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  return (
    <FadeIn className={clsx("h-full", wide && "xl:col-span-2")}>
      <article className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-glow dark:border-white/10 dark:bg-white/[0.04]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-neutral-400 to-transparent opacity-80" />
        {project.category || project.year ? (
          <p className="mb-1.5 text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">
            {[project.category, project.year].filter(Boolean).join(" / ")}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-950 dark:text-white">{project.title}</h3>
        {project.cover_image ? (
          <img src={project.cover_image} alt="" className="mt-2.5 h-24 w-full rounded-md object-cover opacity-90 xl:h-28" />
        ) : null}
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-neutral-600 dark:text-neutral-300">{project.summary}</p>
        <div className="mt-2.5">
          {project.slug ? (
            <a className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-dark dark:bg-white dark:text-neutral-950 dark:hover:bg-[#9ee7e5]" href={`/projects/${project.slug}`}>
              View Project
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </a>
          ) : null}
        </div>
      </article>
    </FadeIn>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to send your message.");
      form.reset();
      setStatus("success");
      setMessage("Thanks - your message has been received. I will get back to you soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  const inputClass = "focus-ring mt-2 w-full rounded-md border border-white/15 bg-[#071012]/75 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500";

  return (
    <form onSubmit={submit} className="relative border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-neutral-200">
          Name
          <input className={inputClass} name="name" type="text" autoComplete="name" maxLength={80} required />
        </label>
        <label className="text-sm font-medium text-neutral-200">
          Email
          <input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-neutral-200">
          Company <span className="font-normal text-neutral-500">(optional)</span>
          <input className={inputClass} name="organization" type="text" autoComplete="organization" maxLength={100} />
        </label>
        <label className="text-sm font-medium text-neutral-200">
          Subject
          <input className={inputClass} name="subject" type="text" maxLength={120} required />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium text-neutral-200">
        Message
        <textarea className={clsx(inputClass, "min-h-28 resize-y")} name="message" minLength={20} maxLength={2000} required />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button disabled={status === "submitting"} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#9ee7e5] disabled:cursor-wait disabled:opacity-70">
          {status === "submitting" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
        {message ? (
          <p className={clsx("max-w-md text-sm", status === "success" ? "text-[#9ee7e5]" : "text-red-300")} role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export default function PortfolioClient({ initialData = defaultPortfolioData }: { initialData?: PublicPortfolioData }) {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(initialData);
  const year = useMemo(() => new Date().getFullYear(), []);
  const { siteContent, projects, education, focusAreas, quickStats, skillGroups } = data;
  const email = siteContent.contactEmail;
  const githubUrl = siteContent.githubUrl;
  const linkedinUrl = siteContent.linkedinUrl;
  const hasEmail = Boolean(email && !email.toLowerCase().includes("example.com"));

  useEffect(() => {
    getPublicPortfolioData().then(setData).catch(() => undefined);
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Galaxy
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
      />
      <div className="noise" />
      <SwarmCursor
        color="#72bdf3"
        accentColor="#e6fbff"
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
      />
      <Navigation githubUrl={githubUrl} linkedinUrl={linkedinUrl} />
      <main id="top" className="relative z-10">
        <section className="site-grid flex min-h-screen items-center px-4 pb-16 pt-24 sm:px-6 md:pb-20 md:pt-28 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <FadeIn>
              <p className="mb-4 inline-flex rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-dark dark:bg-accent/15 dark:text-[#9ee7e5]">
                {siteContent.homepageEyebrow}
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
                {siteContent.homepageTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
                {siteContent.homepageIntro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark dark:bg-white dark:text-neutral-950 dark:hover:bg-[#9ee7e5]" href="#projects">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white/80 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-accent hover:text-accent-dark dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:text-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
                  Download Resume
                  <Download className="h-4 w-4" />
                </a>
              </div>
              <a className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-neutral-600 transition hover:text-accent-dark dark:text-neutral-300 dark:hover:text-[#9ee7e5]" href={githubUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                github.com/Jarvan-1117
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md text-sm font-medium text-neutral-600 transition hover:text-accent-dark dark:text-neutral-300 dark:hover:text-[#9ee7e5]" href={linkedinUrl} target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                linkedin.com/in/jiawen-wang1117
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </FadeIn>
            <FadeIn>
              <HeroPhoto src={siteContent.heroImage} caption={siteContent.heroImageCaption} />
            </FadeIn>
          </div>
        </section>

        <section id="about" className="flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="About" title={siteContent.aboutTitle} />
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <FadeIn className="space-y-5 text-base leading-8 text-neutral-700 dark:text-neutral-300">
                <p>{siteContent.aboutBody1}</p>
                <p>{siteContent.aboutBody2}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {focusAreas.map((area) => (
                    <span key={area} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200">
                      {area}
                    </span>
                  ))}
                </div>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickStats.map((stat) => (
                  <FadeIn key={stat.label}>
                    <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
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

        <section id="projects" className="flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center border-y border-neutral-200 bg-white/60 px-4 py-10 dark:border-white/10 dark:bg-white/[0.025] sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-6xl">
            <SectionLabel eyebrow="Selected Projects" title={siteContent.projectsTitle} compact />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project, index) => (
                <ProjectCard key={project.title} project={project} wide={index === 0 && projects.length % 4 === 3} />
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
                  <div className="h-full rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent-dark dark:bg-accent/20 dark:text-[#9ee7e5]">
                        <group.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">{group.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span key={skill} className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-white/[0.07] dark:text-neutral-200">
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
            <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-neutral-200 dark:before:bg-white/10">
              {education.map((item) => (
                <FadeIn key={item.school}>
                  <article className="relative pl-12">
                    <div className="absolute left-[9px] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-white dark:ring-[#111318]" />
                    <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-950 dark:text-white">{item.school}</h3>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.degree}</p>
                        </div>
                        <span className="text-sm font-medium text-accent-dark dark:text-[#9ee7e5]">{item.period}</span>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.coursework.map((course) => (
                          <span key={course} className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-white/[0.07] dark:text-neutral-200">
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
            <div className="grid gap-8 rounded-lg border border-neutral-200 bg-neutral-950 p-6 text-white shadow-soft dark:border-white/10 dark:bg-white/[0.05] md:grid-cols-[0.72fr_1.28fr] md:p-8">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#9ee7e5]">Contact</p>
                <h2 className="text-2xl font-semibold md:text-3xl">{siteContent.contactTitle}</h2>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-neutral-300">
                  <a className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white" href={githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white" href={linkedinUrl} target="_blank" rel="noreferrer">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  {hasEmail ? (
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {email}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {siteContent.location}
                  </span>
                </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row md:flex-col">
                {hasEmail ? (
                  <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#9ee7e5]" onClick={copyEmail}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy Email"}
                  </button>
                ) : null}
                <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#9ee7e5] hover:text-[#9ee7e5]" href="/resume.pdf" target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
              </div>
              <ContactForm />
            </div>
          </FadeIn>
        </section>
      </main>
      <footer className="relative z-10 border-t border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
        Copyright {year} {siteContent.footerText}
      </footer>
    </>
  );
}
