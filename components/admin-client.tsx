"use client";

import { useEffect, useMemo, useState } from "react";
import {
  slugify,
  type ProjectRow,
  type ContactMessageRow,
  type SiteContent,
  type StructuredSiteContent,
  defaultSiteContent,
  defaultStructuredContent,
  contentRowsToMap,
  structuredContentFromRows,
  type SiteContentRow
} from "@/lib/portfolio-content";

type Session = {
  access_token: string;
  refresh_token?: string;
  user?: { email?: string };
};

const storageKey = "jiawen-portfolio-admin-session";
const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-images";

function supabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  };
}

async function adminRequest<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {})
    }
  });
  if (!response.ok) throw new Error((await response.text()) || "Request failed");
  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

function emptyProject(): Partial<ProjectRow> {
  return {
    title: "",
    slug: "",
    description: "",
    long_description: "",
    year: "",
    category: "",
    tags: [],
    tech_stack: [],
    cover_image: "",
    gallery_images: [],
    project_url: "",
    featured: false,
    visible: true,
    sort_order: 0,
    problem: "",
    dataset: "",
    approach: "",
    models: "",
    evaluation: "",
    results: "",
    learned: ""
  };
}

function listToText(value: string[] | null | undefined) {
  return (value || []).join(", ");
}

function textToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminClient() {
  const configured = Boolean(supabaseConfig().url && supabaseConfig().key);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [structured, setStructured] = useState<StructuredSiteContent>(defaultStructuredContent);
  const [editing, setEditing] = useState<Partial<ProjectRow> | null>(null);
  const [status, setStatus] = useState("");
  const [tab, setTab] = useState<"projects" | "content" | "messages">("projects");
  const token = session?.access_token || "";

  const sortedProjects = useMemo(() => [...projects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)), [projects]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setSession(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (session) void loadAdminData(session.access_token);
  }, [session]);

  const setSavedSession = (next: Session | null) => {
    setSession(next);
    if (next) window.localStorage.setItem(storageKey, JSON.stringify(next));
    else window.localStorage.removeItem(storageKey);
  };

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("Signing in...");
    try {
      const { url, key } = supabaseConfig();
      const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("Login failed");
      const next = (await response.json()) as Session;
      setSavedSession(next);
      setStatus("Signed in.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    }
  };

  const loadAdminData = async (accessToken = token) => {
    if (!accessToken) return;
    setStatus("Loading...");
    try {
      const [projectRows, contentRows, messageRows] = await Promise.all([
        adminRequest<ProjectRow[]>("projects?select=*&order=sort_order.asc", accessToken),
        adminRequest<SiteContentRow[]>("site_content?select=section,key,value", accessToken),
        adminRequest<ContactMessageRow[]>("contact_messages?select=*&order=created_at.desc", accessToken)
      ]);
      setProjects(projectRows);
      setMessages(messageRows);
      setContent(contentRowsToMap(contentRows));
      setStructured(structuredContentFromRows(contentRows));
      setStatus("Loaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load admin data.");
    }
  };

  const uploadImage = async (file: File) => {
    const { url, key } = supabaseConfig();
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${Date.now()}-${safeName}`;
    const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true"
      },
      body: file
    });
    if (!response.ok) throw new Error((await response.text()) || "Upload failed");
    return `${url}/storage/v1/object/public/${bucket}/${path}`;
  };

  const saveContent = async () => {
    setStatus("Saving content...");
    try {
      const rows = Object.entries(content).map(([key, value]) => ({
        section: sectionForKey(key),
        key,
        value
      })).concat(
        Object.entries(structured).map(([key, value]) => ({
          section: sectionForKey(key),
          key,
          value: JSON.stringify(value)
        }))
      );
      await adminRequest("site_content?on_conflict=key", token, {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify(rows)
      });
      setStatus("Content saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save content.");
    }
  };

  const saveProject = async () => {
    if (!editing?.title) {
      setStatus("Project title is required.");
      return;
    }
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      sort_order: Number(editing.sort_order ?? projects.length),
      tags: editing.tags || [],
      tech_stack: editing.tech_stack || [],
      gallery_images: editing.gallery_images || []
    };

    setStatus("Saving project...");
    try {
      if (editing.id) {
        await adminRequest<ProjectRow[]>(`projects?id=eq.${editing.id}`, token, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        await adminRequest<ProjectRow[]>("projects", token, {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setEditing(null);
      await loadAdminData();
      setStatus("Project saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save project.");
    }
  };

  const deleteProject = async (project: ProjectRow) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    setStatus("Deleting project...");
    try {
      await adminRequest(`projects?id=eq.${project.id}`, token, { method: "DELETE" });
      await loadAdminData();
      setStatus("Project deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete project.");
    }
  };

  const moveProject = async (project: ProjectRow, direction: -1 | 1) => {
    const currentIndex = sortedProjects.findIndex((item) => item.id === project.id);
    const swap = sortedProjects[currentIndex + direction];
    if (!swap) return;
    await Promise.all([
      adminRequest(`projects?id=eq.${project.id}`, token, { method: "PATCH", body: JSON.stringify({ sort_order: swap.sort_order }) }),
      adminRequest(`projects?id=eq.${swap.id}`, token, { method: "PATCH", body: JSON.stringify({ sort_order: project.sort_order }) })
    ]);
    await loadAdminData();
  };

  const updateMessageStatus = async (message: ContactMessageRow, status: ContactMessageRow["status"]) => {
    setStatus("Updating message...");
    try {
      await adminRequest(`contact_messages?id=eq.${message.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      await loadAdminData();
      setStatus("Message updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update message.");
    }
  };

  const deleteMessage = async (message: ContactMessageRow) => {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setStatus("Deleting message...");
    try {
      await adminRequest(`contact_messages?id=eq.${message.id}`, token, { method: "DELETE" });
      await loadAdminData();
      setStatus("Message deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete message.");
    }
  };

  if (!configured) {
    return (
      <main className="min-h-screen bg-[#0f1115] px-4 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-2xl font-semibold">Admin setup required</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment before using the admin panel.
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center bg-[#0f1115] px-4 py-20 text-white">
        <form onSubmit={signIn} className="mx-auto w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-soft">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <input className="mt-6 w-full rounded-md border border-white/10 bg-[#071012] px-3 py-2 text-sm" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="mt-3 w-full rounded-md border border-white/10 bg-[#071012] px-3 py-2 text-sm" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="mt-5 w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-[#9ee7e5]">Login</button>
          {status ? <p className="mt-4 text-sm text-neutral-300">{status}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1115] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Portfolio Admin</h1>
            <p className="mt-2 text-sm text-neutral-400">{session.user?.email}</p>
          </div>
          <button className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold hover:border-[#9ee7e5] hover:text-[#9ee7e5]" onClick={() => setSavedSession(null)}>
            Logout
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          <button className={tabButton(tab === "projects")} onClick={() => setTab("projects")}>Projects</button>
          <button className={tabButton(tab === "content")} onClick={() => setTab("content")}>Site Content</button>
          <button className={tabButton(tab === "messages")} onClick={() => setTab("messages")}>Messages{messages.some((message) => message.status === "new") ? " *" : ""}</button>
        </div>

        {status ? <p className="mb-5 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-300">{status}</p> : null}

        {tab === "projects" ? (
          <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-[#9ee7e5]" onClick={() => setEditing({ ...emptyProject(), sort_order: projects.length })}>
                  Add Project
                </button>
              </div>
              <div className="space-y-3">
                {sortedProjects.map((project) => (
                  <div key={project.id} className="rounded-md border border-white/10 bg-[#071012]/70 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="mt-1 text-xs text-neutral-400">{project.visible ? "Visible" : "Hidden"} / {project.featured ? "Featured" : "Regular"}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="rounded border border-white/10 px-2 py-1 text-xs" onClick={() => moveProject(project, -1)}>Up</button>
                        <button className="rounded border border-white/10 px-2 py-1 text-xs" onClick={() => moveProject(project, 1)}>Down</button>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-md border border-white/15 px-3 py-1.5 text-sm hover:text-[#9ee7e5]" onClick={() => setEditing(project)}>Edit</button>
                      <button className="rounded-md border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10" onClick={() => deleteProject(project)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProjectEditor editing={editing} setEditing={setEditing} saveProject={saveProject} uploadImage={uploadImage} />
          </section>
        ) : tab === "content" ? (
          <ContentEditor content={content} setContent={setContent} structured={structured} setStructured={setStructured} saveContent={saveContent} uploadImage={uploadImage} />
        ) : (
          <ContactMessages messages={messages} updateStatus={updateMessageStatus} deleteMessage={deleteMessage} />
        )}
      </div>
    </main>
  );
}

function ContactMessages({
  messages,
  updateStatus,
  deleteMessage
}: {
  messages: ContactMessageRow[];
  updateStatus: (message: ContactMessageRow, status: ContactMessageRow["status"]) => void;
  deleteMessage: (message: ContactMessageRow) => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Contact Messages</h2>
          <p className="mt-1 text-sm text-neutral-400">Messages submitted through the public contact form.</p>
        </div>
        <span className="text-sm text-neutral-400">{messages.length} total</span>
      </div>
      {messages.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {messages.map((message) => (
            <article key={message.id} className="rounded-lg border border-white/10 bg-[#071012]/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{message.subject}</h3>
                  <p className="mt-1 text-sm text-neutral-300">{message.name}{message.organization ? ` / ${message.organization}` : ""}</p>
                  <a className="mt-1 inline-block text-sm text-[#9ee7e5] hover:underline" href={`mailto:${message.email}`}>{message.email}</a>
                </div>
                <span className={message.status === "new" ? "rounded bg-[#9ee7e5]/15 px-2 py-1 text-xs text-[#9ee7e5]" : "rounded bg-white/10 px-2 py-1 text-xs text-neutral-300"}>
                  {message.status}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{message.message}</p>
              <p className="mt-4 text-xs text-neutral-500">{new Date(message.created_at).toLocaleString()}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-neutral-950 hover:bg-[#9ee7e5]" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>Reply</a>
                {message.status !== "contacted" ? <button className="rounded-md border border-white/15 px-3 py-2 text-xs hover:text-[#9ee7e5]" onClick={() => updateStatus(message, "contacted")}>Mark Contacted</button> : null}
                {message.status !== "archived" ? <button className="rounded-md border border-white/15 px-3 py-2 text-xs hover:text-[#9ee7e5]" onClick={() => updateStatus(message, "archived")}>Archive</button> : null}
                <button className="rounded-md border border-red-400/40 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10" onClick={() => deleteMessage(message)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-white/10 bg-[#071012]/70 p-5 text-sm text-neutral-400">No messages yet.</p>
      )}
    </section>
  );
}

function ProjectEditor({
  editing,
  setEditing,
  saveProject,
  uploadImage
}: {
  editing: Partial<ProjectRow> | null;
  setEditing: (project: Partial<ProjectRow> | null) => void;
  saveProject: () => void;
  uploadImage: (file: File) => Promise<string>;
}) {
  if (!editing) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-neutral-300">
        Select a project or click Add Project.
      </div>
    );
  }

  const update = (patch: Partial<ProjectRow>) => setEditing({ ...editing, ...patch });

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="mb-5 text-xl font-semibold">{editing.id ? "Edit Project" : "Add Project"}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" value={editing.title || ""} onChange={(value) => update({ title: value, slug: editing.slug || slugify(value) })} />
        <Field label="Slug" value={editing.slug || ""} onChange={(value) => update({ slug: slugify(value) })} />
        <Field label="Year" value={editing.year || ""} onChange={(value) => update({ year: value })} />
        <Field label="Category" value={editing.category || ""} onChange={(value) => update({ category: value })} />
        <Field label="Tags, comma separated" value={listToText(editing.tags)} onChange={(value) => update({ tags: textToList(value) })} />
        <Field label="Tech stack, comma separated" value={listToText(editing.tech_stack)} onChange={(value) => update({ tech_stack: textToList(value) })} />
        <Field label="Project URL" value={editing.project_url || ""} onChange={(value) => update({ project_url: value })} />
        <Field label="Sort order" value={String(editing.sort_order ?? 0)} onChange={(value) => update({ sort_order: Number(value) })} />
      </div>
      <TextArea label="Short description" value={editing.description || ""} onChange={(value) => update({ description: value })} />
      <TextArea label="Detailed description" value={editing.long_description || ""} onChange={(value) => update({ long_description: value })} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Checkbox label="Visible on website" checked={editing.visible !== false} onChange={(value) => update({ visible: value })} />
        <Checkbox label="Featured project" checked={Boolean(editing.featured)} onChange={(value) => update({ featured: value })} />
      </div>
      <ImageDrop label="Cover image" value={editing.cover_image || ""} onUpload={async (file) => update({ cover_image: await uploadImage(file) })} />
      <ImageDrop label="Gallery images" multiple value={(editing.gallery_images || []).join(", ")} onUpload={async (file) => update({ gallery_images: [...(editing.gallery_images || []), await uploadImage(file)] })} />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {["problem", "dataset", "approach", "models", "evaluation", "results", "learned"].map((key) => (
          <TextArea key={key} label={key} value={String(editing[key as keyof ProjectRow] || "")} onChange={(value) => update({ [key]: value } as Partial<ProjectRow>)} />
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-[#9ee7e5]" onClick={saveProject}>Save</button>
        <button className="rounded-md border border-white/15 px-5 py-2 text-sm font-semibold hover:text-[#9ee7e5]" onClick={() => setEditing(null)}>Cancel</button>
      </div>
    </div>
  );
}

function ContentEditor({
  content,
  setContent,
  structured,
  setStructured,
  saveContent,
  uploadImage
}: {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  structured: StructuredSiteContent;
  setStructured: (content: StructuredSiteContent) => void;
  saveContent: () => void;
  uploadImage: (file: File) => Promise<string>;
}) {
  const update = (key: keyof SiteContent, value: string) => setContent({ ...content, [key]: value });
  const updateQuickStat = (index: number, patch: Partial<StructuredSiteContent["quickStats"][number]>) => {
    const next = structured.quickStats.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    setStructured({ ...structured, quickStats: next });
  };
  const updateSkillGroup = (index: number, patch: Partial<StructuredSiteContent["skillGroups"][number]>) => {
    const next = structured.skillGroups.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    setStructured({ ...structured, skillGroups: next });
  };
  const updateEducation = (index: number, patch: Partial<StructuredSiteContent["education"][number]>) => {
    const next = structured.education.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    setStructured({ ...structured, education: next });
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="mb-5 text-xl font-semibold">Site Content</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Homepage eyebrow" value={content.homepageEyebrow} onChange={(value) => update("homepageEyebrow", value)} />
        <Field label="Homepage title" value={content.homepageTitle} onChange={(value) => update("homepageTitle", value)} />
        <Field label="Contact email" value={content.contactEmail} onChange={(value) => update("contactEmail", value)} />
        <Field label="Location" value={content.location} onChange={(value) => update("location", value)} />
        <Field label="GitHub URL" value={content.githubUrl} onChange={(value) => update("githubUrl", value)} />
        <Field label="LinkedIn URL" value={content.linkedinUrl} onChange={(value) => update("linkedinUrl", value)} />
        <Field label="Instagram URL" value={content.instagramUrl} onChange={(value) => update("instagramUrl", value)} />
        <Field label="Footer text" value={content.footerText} onChange={(value) => update("footerText", value)} />
      </div>
      <TextArea label="Homepage introduction" value={content.homepageIntro} onChange={(value) => update("homepageIntro", value)} />
      <TextArea label="About title" value={content.aboutTitle} onChange={(value) => update("aboutTitle", value)} />
      <TextArea label="About Me paragraph 1" value={content.aboutBody1} onChange={(value) => update("aboutBody1", value)} />
      <TextArea label="Bio paragraph 2" value={content.aboutBody2} onChange={(value) => update("aboutBody2", value)} />
      <TextArea label="Projects section title" value={content.projectsTitle} onChange={(value) => update("projectsTitle", value)} />
      <TextArea label="Skills section title" value={content.skillsTitle} onChange={(value) => update("skillsTitle", value)} />
      <TextArea label="Education section title" value={content.educationTitle} onChange={(value) => update("educationTitle", value)} />
      <TextArea label="Contact title" value={content.contactTitle} onChange={(value) => update("contactTitle", value)} />
      <ImageDrop label="Homepage / Hero image" value={content.heroImage} onUpload={async (file) => update("heroImage", await uploadImage(file))} />
      <TextArea label="Hero image alt text" value={content.heroImageCaption} onChange={(value) => update("heroImageCaption", value)} />

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold">Focus Areas</h3>
        <Field label="Comma separated" value={listToText(structured.focusAreas)} onChange={(value) => setStructured({ ...structured, focusAreas: textToList(value) })} />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold">Quick Stats</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {structured.quickStats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="rounded-md border border-white/10 bg-[#071012]/70 p-4">
              <Field label="Label" value={stat.label} onChange={(value) => updateQuickStat(index, { label: value })} />
              <div className="mt-3">
                <Field label="Value" value={stat.value} onChange={(value) => updateQuickStat(index, { value })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {structured.skillGroups.map((group, index) => (
            <div key={`${group.title}-${index}`} className="rounded-md border border-white/10 bg-[#071012]/70 p-4">
              <Field label="Group title" value={group.title} onChange={(value) => updateSkillGroup(index, { title: value })} />
              <TextArea label="Skills, comma separated" value={listToText(group.skills)} onChange={(value) => updateSkillGroup(index, { skills: textToList(value) })} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold">Education</h3>
        <div className="mt-4 space-y-4">
          {structured.education.map((item, index) => (
            <div key={`${item.school}-${index}`} className="rounded-md border border-white/10 bg-[#071012]/70 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="School" value={item.school} onChange={(value) => updateEducation(index, { school: value })} />
                <Field label="Degree" value={item.degree} onChange={(value) => updateEducation(index, { degree: value })} />
                <Field label="Period" value={item.period} onChange={(value) => updateEducation(index, { period: value })} />
                <Field label="Coursework, comma separated" value={listToText(item.coursework)} onChange={(value) => updateEducation(index, { coursework: textToList(value) })} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-6 rounded-md bg-white px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-[#9ee7e5]" onClick={saveContent}>Save Content</button>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-neutral-300">{label}</span>
      <input className="mt-2 w-full rounded-md border border-white/10 bg-[#071012] px-3 py-2 text-sm text-white" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block text-sm">
      <span className="text-neutral-300">{label}</span>
      <textarea className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-[#071012] px-3 py-2 text-sm text-white" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-white/10 bg-[#071012] px-3 py-2 text-sm text-neutral-200">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function ImageDrop({ label, value, multiple = false, onUpload }: { label: string; value: string; multiple?: boolean; onUpload: (file: File) => Promise<void> }) {
  const [uploading, setUploading] = useState(false);
  const images = value.split(",").map((item) => item.trim()).filter(Boolean);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) await onUpload(file);
    setUploading(false);
  };

  return (
    <div className="mt-5">
      <p className="mb-2 text-sm text-neutral-300">{label}</p>
      <label
        className="block cursor-pointer rounded-md border border-dashed border-white/20 bg-[#071012] p-4 text-center text-sm text-neutral-400 hover:border-[#9ee7e5] hover:text-[#9ee7e5]"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
      >
        {uploading ? "Uploading..." : "Upload Image or Drag & Drop"}
        <input className="hidden" type="file" accept="image/*" multiple={multiple} onChange={(event) => void handleFiles(event.target.files)} />
      </label>
      {images.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((image) => (
            <img key={image} className="aspect-video rounded-md border border-white/10 object-cover" src={image} alt="" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function tabButton(active: boolean) {
  return active
    ? "rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
    : "rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-[#9ee7e5] hover:text-[#9ee7e5]";
}

function sectionForKey(key: string) {
  if (key.startsWith("homepage") || key.startsWith("hero")) return "homepage";
  if (key.startsWith("about")) return "about";
  if (key.startsWith("projects")) return "projects";
  if (key.startsWith("skills") || key === "skillGroups") return "skills";
  if (key.startsWith("education")) return "education";
  if (key === "focusAreas" || key === "quickStats") return "about";
  if (key.startsWith("contact") || key.includes("Url") || key === "location") return "contact";
  return "global";
}
