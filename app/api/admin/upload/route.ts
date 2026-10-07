import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

const BUCKET = "media-house-files";
const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED = [
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "application/pdf",
  "video/mp4", "video/quicktime", "video/webm",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function safeName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(-90);
}

/**
 * Admin-only upload for a project deliverable.
 *
 * The RLS policies on storage.objects are the real gate; this route checks
 * the admin flag too so a mistake fails fast with a clear message.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!(me as { is_admin?: boolean } | null)?.is_admin) {
    return NextResponse.json({ error: "Staff only." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const projectId = String(form.get("projectId") ?? "");
  const milestoneId = String(form.get("milestoneId") ?? "") || null;
  const label = String(form.get("label") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 25 MB." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: `That file type is not allowed (${file.type || "unknown"}).` },
      { status: 400 },
    );
  }
  if (!projectId) {
    return NextResponse.json({ error: "Missing project." }, { status: 400 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const path = `${projectId}/${stamp}/${Date.now()}-${safeName(file.name)}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const ext = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";

  const { data: row, error: dbErr } = await supabase
    .from("deliverables")
    .insert({
      project_id: projectId,
      milestone_id: milestoneId,
      label: label || file.name,
      file_url: pub.publicUrl,
      file_type: ext.toLowerCase() || file.type.split("/")[1] || "file",
      version: null,
    })
    .select("id")
    .single();

  if (dbErr) {
    // Do not leave an orphan in the bucket.
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    id: row.id,
    url: pub.publicUrl,
    label: label || file.name,
  });
}