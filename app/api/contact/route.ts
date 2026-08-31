import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 4;
const submissions = new Map<string, number[]>();

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  submissions.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }

  if (clean(body.website)) {
    return NextResponse.json({ message: "Thanks - your message has been received." });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const organization = clean(body.organization);
  const subject = clean(body.subject);
  const message = clean(body.message);

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ message: "Please enter your name." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }
  if (organization.length > 100 || subject.length < 2 || subject.length > 120 || message.length < 20 || message.length > 2000) {
    return NextResponse.json({ message: "Please complete the subject and message fields." }, { status: 400 });
  }

  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(clientKey)) {
    return NextResponse.json({ message: "Too many messages were sent. Please try again later." }, { status: 429 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ message: "The contact form is being configured. Please use LinkedIn for now." }, { status: 503 });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({ name, email, organization: organization || null, subject, message })
  });

  if (!response.ok) {
    console.error("Contact submission failed", response.status, await response.text());
    return NextResponse.json({ message: "Your message could not be saved. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks - your message has been received." });
}
