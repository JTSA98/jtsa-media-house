"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Paperclip, Upload } from "lucide-react";

/**
 * Admin-only file upload against a project's deliverables.
 * Drop in files from the phone or desktop; nothing leaves the browser until
 * you press Upload.
 */
export function FileUploader({
  projectId,
  milestoneId,
  defaultLabel,
}: {
  projectId: string;
  milestoneId?: string | null;
  defaultLabel?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [label, setLabel] = useState(defaultLabel ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  async function upload() {
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    const uploaded: string[] = [];

    for (const file of files) {
      const body = new FormData();
      body.set("file", file);
      body.set("projectId", projectId);
      if (milestoneId) body.set("milestoneId", milestoneId);
      body.set(
        "label",
        label.trim() ? `${label.trim()} — ${file.name}` : file.name,
      );

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json();

        if (!res.ok) {
          setError(`${file.name}: ${json.error ?? "upload failed"}`);
          break;
        }
        uploaded.push(json.label);
      } catch {
        setError(`${file.name}: network error`);
        break;
      }
    }

    setDone(uploaded);
    setFiles([]);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="border-[2.5px] border-dashed border-ink/40 bg-sticky p-4">
      <p className="mb-2.5 flex items-center gap-2 text-[13px] font-extrabold">
        <Paperclip size={15} className="text-green" />
        Deliver a file to the client
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov,.webm,.zip,.doc,.docx"
        onChange={(e) => addFiles(e.target.files)}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-white !px-3 !py-2 !text-[12px]"
        >
          <Upload size={14} className="mr-1.5" /> Choose files
        </button>

        {files.length ? (
          <button
            type="button"
            onClick={upload}
            disabled={busy}
            className="btn btn-green !px-3 !py-2 !text-[12px] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                Upload {files.length} file{files.length > 1 ? "s" : ""}
              </>
            )}
          </button>
        ) : null}
      </div>

      {files.length ? (
        <div className="mt-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional label, e.g. Admission poster"
            className="field !py-2 !text-[12.5px]"
          />
          <ul className="mt-2 flex flex-col gap-1 text-[12.5px] text-ink-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2">
                <span aria-hidden>·</span>
                <span className="truncate">{f.name}</span>
                <span className="text-ink-3">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                <button
                  type="button"
                  onClick={() => setFiles((p) => p.filter((_, x) => x !== i))}
                  className="ml-auto font-extrabold text-red underline"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2.5 flex items-start gap-2 border-2 border-red bg-[#FBE7E2] px-3 py-2 text-[12.5px] text-ink">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-red" />
          {error}
        </p>
      ) : null}

      {done.length ? (
        <p className="mt-2.5 flex items-start gap-2 border-2 border-green bg-[#DFF0E2] px-3 py-2 text-[12.5px] text-ink">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green" />
          Uploaded {done.length} file{done.length > 1 ? "s" : ""}. The client can see{" "}
          {done.length > 1 ? "them" : "it"} in their portal now.
        </p>
      ) : null}

      <p className="mt-2 text-[11.5px] text-ink-3">
        PDF, images, video or zip · up to 25 MB each
      </p>
    </div>
  );
}