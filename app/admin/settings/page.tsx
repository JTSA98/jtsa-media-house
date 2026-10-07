import Link from "next/link";
import { ArrowLeft, Database, TriangleAlert } from "lucide-react";

import { SettingsForm, SecretStatus } from "@/components/admin/SettingsForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchSettingRows,
  groupLabels,
  groupOrder,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const rows = await fetchSettingRows();
  const ready = isSupabaseConfigured && rows.length > 0;

  const razorpayKey = process.env.RAZORPAY_KEY_ID ?? "";
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const brevo = process.env.BREVO_API_KEY ?? "";

  return (
    <div className="flex flex-col gap-7">
      <div>
        <Link
          href="/admin"
          className="mb-3 flex w-fit items-center gap-2 text-[13px] font-extrabold text-ink-2 transition hover:gap-3 hover:text-green"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </Link>
        <p className="hand -rotate-2 text-[clamp(20px,2.6vw,28px)] text-red">
          Control the whole site
        </p>
        <h1 className="mt-1 text-[clamp(28px,4.6vw,48px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
          Site <span className="text-green">settings</span>
        </h1>
        <p className="mt-3 max-w-[62ch] text-[14.5px] leading-[1.8] text-ink-2">
          Everything below is read from the database. Save, and the public site
          changes — no redeploy, no code edit.
        </p>
      </div>

      {!ready ? (
        <div className="border-[2.5px] border-dashed border-red bg-[#FBE7E2] p-5">
          <p className="flex items-start gap-2 text-[14px] font-bold">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-red" />
            Settings table not ready
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.75]">
            {!isSupabaseConfigured
              ? "Supabase is not configured, so nothing can be loaded."
              : "Run supabase/migration_settings.sql in the SQL editor, then reload this page."}
          </p>
        </div>
      ) : (
        <>
          {/* ── secret status ── */}
          <section>
            <h2 className="mb-3 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
              <span className="inline-block h-[2.5px] w-8 bg-red" />
              Integration keys
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <SecretStatus
                label="Razorpay key id"
                name={razorpayKey ? `ends …${razorpayKey.slice(-4)}` : "RAZORPAY_KEY_ID"}
                configured={Boolean(razorpayKey)}
              />
              <SecretStatus
                label="Razorpay key secret"
                name={razorpaySecret ? `set (${razorpaySecret.length} chars)` : "RAZORPAY_KEY_SECRET"}
                configured={Boolean(razorpaySecret)}
              />
              <SecretStatus
                label="Brevo email"
                name={brevo ? "set" : "BREVO_API_KEY"}
                configured={Boolean(brevo)}
              />
            </div>
            <p className="mt-2.5 text-[12.5px] text-ink-3">
              Keys live in environment variables, never in the database. Add them
              to <code className="font-mono">.env.local</code> and to Vercel.
            </p>
          </section>

          <SettingsForm rows={rows} groups={groupOrder} labels={groupLabels} />

          <p className="flex items-start gap-2 text-[12.5px] leading-[1.7] text-ink-3">
            <Database size={14} className="mt-0.5 shrink-0" />
            Stored in <code className="font-mono">public.site_settings</code>. Plan
            features use one per line; the table stores them pipe-separated.
          </p>
        </>
      )}
    </div>
  );
}