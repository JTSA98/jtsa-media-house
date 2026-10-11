# Online payments (Razorpay)

The site accepts online payment for **everything**: monthly retainers,
fixed-price jobs, flex advance, and portal balance dues. Until the keys
land, every Pay button stays hidden and the site is UPI-only — nothing
looks broken.

## 1. Run the SQL (once)

In the Media House Supabase project → SQL editor, run:

- `supabase/migration_payments.sql` — the `payments` ledger table
- `supabase/migration_settings.sql` — re-run safe; adds `budget.bands`,
  `budget.mids`, `pay.flex_advance`, `portal.client_login` if missing

## 2. Add the keys

Razorpay Dashboard → Settings → API Keys. **Start in Test Mode.**

| Variable              | Where           | Notes                              |
| --------------------- | --------------- | ---------------------------------- |
| `RAZORPAY_KEY_ID`     | `.env.local` + Vercel | `rzp_test_…` first, `rzp_live_…` after KYC |
| `RAZORPAY_KEY_SECRET` | `.env.local` + Vercel | server-only, never `NEXT_PUBLIC_`  |

Check `/admin/settings` → Integration keys: both should show green.

## 3. Flip the switch

`/admin/settings` → Payments → **Accept online payment** = `true`.
Pay buttons appear immediately: pricing plans, one-time jobs, service
cards, and the portal balance box. No redeploy.

## 4. Webhook (recommended)

Razorpay Dashboard → Settings → Webhooks → Add:

- URL: `https://<your-domain>/api/payments/webhook`
- Events: `payment.captured`
- Secret: leave default (uses the key secret)

This is the safety net: if a payer closes the tab after paying, the
checkout callback never fires but the webhook still confirms it. Both
funnel into one idempotent apply function — double delivery is a no-op.

## 5. Test

- Test card: `4111 1111 1111 1111`, any future expiry, any CVV.
- Pay ₹1 online for a plan in test mode, then check:
  1. `payments` table row → `paid`, with Razorpay ids.
  2. Plans/jobs → a new row in **enquiries** ("Paid online …").
  3. Portal dues → the project's `paid_amount` grew (capped at agreed).
- Flip `payments.enabled` back to `false` anytime to hide it all again.

## How amounts work (nothing hardcoded)

Every charge resolves server-side in `lib/payments.ts`:

- Plans/jobs → digits parsed from the **settings** price strings
  (the same strings shown on the page).
- Flex → `pay.flex_advance` setting (flat advance, per-sq.ft bills later).
- Dues → `agreed − paid` read fresh from the project row, ownership
  enforced by RLS (`client_id = auth.uid()`).

The browser only names the item. `/api/payments/order` ignores any
amount it is sent.

## Going live

1. Complete Razorpay KYC, generate **live** keys.
2. Swap both env vars locally + on Vercel, redeploy.
3. Do one real ₹1 payment yourself first.
