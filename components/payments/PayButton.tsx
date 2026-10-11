"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Lock } from "lucide-react";

/* Razorpay checkout.js surface — only what we call. */
interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (err: { error: { description?: string } }) => void) => void;
}

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let checkoutPromise: Promise<void> | null = null;

function loadCheckout(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  if (!checkoutPromise) {
    checkoutPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        checkoutPromise = null;
        reject(new Error("Could not load the payment window."));
      };
      document.body.appendChild(script);
    });
  }
  return checkoutPromise;
}

type State = "idle" | "working" | "paid" | "error";

/**
 * One-tap online payment for a settings-priced item or a portal due.
 * Renders NOTHING until /api/payments/config says live — so before the
 * keys land, the site is exactly as it is today (UPI only).
 */
export function PayButton({
  kind,
  itemKey,
  projectId,
  label,
  className,
}: {
  kind: "plan" | "job" | "due";
  itemKey?: string;
  projectId?: string;
  /** Button text, e.g. "Pay ₹9,999 online". Display only. */
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [config, setConfig] = useState<{ enabled: boolean; keyId: string | null } | null>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/config")
      .then((r) => r.json())
      .then((c) => setConfig({ enabled: c.enabled === true, keyId: c.keyId ?? null }))
      .catch(() => setConfig({ enabled: false, keyId: null }));
  }, []);

  if (!config || !config.enabled || !config.keyId) return null;

  async function pay() {
    setState("working");
    setError(null);

    try {
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          kind === "due" ? { kind, projectId } : { kind, key: itemKey },
        ),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        title?: string;
      };

      if (!data.ok || !data.orderId) {
        throw new Error(data.error ?? "Could not start the payment.");
      }

      await loadCheckout();
      if (!window.Razorpay) throw new Error("Payment window failed to load.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "JTSA Media House",
        description: data.title,
        order_id: data.orderId,
        theme: { color: "#0B192C" },
        modal: { ondismiss: () => setState("idle") },
        handler: async (resp: RazorpaySuccess) => {
          try {
            const vres = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              }),
            });
            const vdata = (await vres.json()) as { ok: boolean; error?: string };
            if (!vdata.ok) throw new Error(vdata.error ?? "Could not confirm the payment.");
            setState("paid");
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not confirm the payment.");
            setState("error");
          }
        },
      });

      rzp.on("payment.failed", (err) => {
        setError(err?.error?.description ?? "The payment did not go through.");
        setState("error");
      });

      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "paid") {
    return (
      <p className="flex items-center gap-2 rounded-sm border border-green/40 bg-green/8 px-4 py-3 text-[13.5px] font-semibold text-ink">
        <Check size={17} className="shrink-0 text-green" />
        Paid online — receipt follows on WhatsApp and email.
      </p>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={pay}
        disabled={state === "working"}
        className="btn btn-green inline-flex w-full items-center justify-center gap-2 !tracking-[0.1em] !uppercase disabled:opacity-60"
      >
        {state === "working" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Contacting bank…
          </>
        ) : (
          <>
            <Lock size={15} /> {label}
          </>
        )}
      </button>
      {state === "error" && error ? (
        <p className="mt-2 text-[12.5px] leading-[1.6] text-red">
          {error}{" "}
          <button type="button" onClick={pay} className="font-bold underline">
            Try again
          </button>
        </p>
      ) : null}
    </div>
  );
}
