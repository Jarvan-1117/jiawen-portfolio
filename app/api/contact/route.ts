import { NextResponse } from "next/server";
import { defaultSiteContent } from "@/lib/portfolio-content";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { message: `This form is no longer available. Please email ${defaultSiteContent.contactEmail} or connect on LinkedIn.` },
    { status: 410 }
  );
}
