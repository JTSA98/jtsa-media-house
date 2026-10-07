-- ══════════════════════════════════════════════════════════════════════
--  Migration — site settings
--
--  A key/value table so the whole site can be edited from /admin/settings
--  without touching code. Same pattern as the Olympiad site's site_settings.
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run — existing keys are updated, not duplicated.
-- ══════════════════════════════════════════════════════════════════════

create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  group_name text not null default 'general',
  label      text,
  hint       text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- everyone may read settings (they are public site content anyway)
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);

-- only admins may change them
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ─── seed defaults ───────────────────────────────────────────────────
-- Anything already set keeps its value; these only fill in the blanks.
insert into public.site_settings (key, value, group_name, label, hint, sort_order) values
  -- contact ------------------------------------------------------------
  ('site.phone',        '+91 00000 00000',  'contact', 'Phone number',        'Shown in the header, footer and CTA.', 1),
  ('site.phone_digits', '910000000000',    'contact', 'WhatsApp number',      'Digits only, with country code and no + or spaces.', 2),
  ('site.email',        'hello@jtsamediahouse.in', 'contact', 'Email address', 'Where enquiries and receipts go.', 3),
  ('site.upi',          'jtsamedia@upi',   'contact', 'UPI ID',               'Clients pay to this ID.', 4),
  ('site.city',         'Dhanbad',         'contact', 'City',                 '', 5),
  ('site.state',        'Jharkhand',       'contact', 'State',                '', 6),
  ('site.udyam',        'UDYAM-JH-04-0091747', 'contact', 'MSME / UDYAM number', 'Leave blank to hide it.', 7),

  -- brand -------------------------------------------------------------
  ('brand.tagline',      'Aaj ka Prachar, Kal ki Pehchaan', 'brand', 'Tagline',        '', 1),
  ('brand.promise',      'Naam Bada Kar Denge',              'brand', 'Hindi promise',  'Shown in the hero and the closing band.', 2),
  ('brand.owner',        'Jharkhand Talent Search Association', 'brand', 'Parent body',  '', 3),
  ('brand.short',        'JTSA',                            'brand', 'Parent short name', '', 4),
  ('brand.name',         'JTSA Media House',                'brand', 'Site name',      '', 5),

  -- social ------------------------------------------------------------
  ('social.instagram', '', 'social', 'Instagram URL', '', 1),
  ('social.facebook',  '', 'social', 'Facebook URL',  '', 2),
  ('social.youtube',   '', 'social', 'YouTube URL',   '', 3),
  ('social.linkedin',  '', 'social', 'LinkedIn URL',  '', 4),

  -- payments ----------------------------------------------------------
  ('payments.enabled',      'false', 'payments', 'Accept online payment', 'true or false. When false the site shows UPI only.', 1),
  ('payments.provider',     'razorpay', 'payments', 'Gateway',            'razorpay for now.', 2),
  ('payments.currency',     'INR',    'payments', 'Currency',            '', 3),
  ('payments.note',         'Pay by UPI or at your school office. Receipt issued either way.', 'payments', 'Payment note', 'Shown under the payment box.', 4),

  -- stats -------------------------------------------------------------
  ('stats.0', '50+',    'stats', 'Partner schools', '', 1),
  ('stats.1', '1,000+', 'stats', 'Students reached', '', 2),
  ('stats.2', '500+',   'stats', 'Creatives shipped', '', 3),
  ('stats.3', '48h',    'stats', 'Turnaround',        '', 4),

  -- enquiry -----------------------------------------------------------
  ('enquiry.enabled', 'true', 'enquiry', 'Show the enquiry form', 'false hides it and shows only the contact details.', 1),
  ('enquiry.whatsapp', 'true', 'enquiry', 'Show the WhatsApp button', '', 2),
  ('enquiry.reply_note', 'We reply within 24 hours, usually much sooner.', 'enquiry', 'Reply promise', '', 3),
  ('enquiry.sample_offer', 'Get a Free Design Sample', 'enquiry', 'Sample offer text', 'The main call to action.', 4),

  -- one-time pricing --------------------------------------------------
  ('price.flex',    '₹35 / sq.ft', 'prices', 'Flex printing', 'Design included.', 1),
  ('price.flex_note',    'Flex printing, design included', 'prices', '', '', 2),
  ('price.standee', '₹1,799',       'prices', 'Roll-up standee', 'With design.', 3),
  ('price.standee_note', 'Roll-up standee with design', 'prices', '', '', 4),
  ('price.poster',  '₹499',         'prices', 'Poster design + print', '', 5),
  ('price.poster_note', 'Poster — design + print', 'prices', '', '', 6),
  ('price.shoot',   '₹14,999',      'prices', 'Half-day event shoot', '', 7),
  ('price.shoot_note', 'Half-day event shoot', 'prices', '', '', 8),

  -- retainer plans ----------------------------------------------------
  ('plan.starter.name',  'Starter',  'plans', 'Starter — name',  '', 1),
  ('plan.starter.price', '4,999',    'plans', 'Starter — price', 'Digits only.', 2),
  ('plan.starter.features', '8 social posts|2 reels|1 poster design|Monthly report', 'plans', '', 'One feature per line.', 3),
  ('plan.growth.name',    'Growth',   'plans', 'Growth — name',   '', 4),
  ('plan.growth.price',   '9,999',    'plans', 'Growth — price',  'Digits only.', 5),
  ('plan.growth.badge',   'Most Chosen', 'plans', 'Growth — badge', 'Leave blank for none.', 6),
  ('plan.growth.features', '12 posts + 4 reels|Boost management|2 poster designs|Website listing|Priority support', 'plans', '', 'One feature per line.', 7),
  ('plan.premium.name',    'Premium', 'plans', 'Premium — name',  '', 8),
  ('plan.premium.price',   '19,999',  'plans', 'Premium — price', 'Digits only.', 9),
  ('plan.premium.features', '20 posts + 8 reels|Full campaign strategy|Event shoot coverage|Everything in Growth', 'plans', '', 'One feature per line.', 10),

  -- services ----------------------------------------------------------
  ('service.posters-banners.price',     '₹299',   'services', 'Posters & Banners — from', '', 1),
  ('service.posters-banners.price_note','from, per design', 'services', '', '', 2),
  ('service.social-campaigns.price',    '₹4,999', 'services', 'Social Campaigns — per month', '', 3),
  ('service.social-campaigns.price_note','per month', 'services', '', '', 4),
  ('service.video-reels.price',         '₹4,999', 'services', 'Video & Reels — per reel', '', 5),
  ('service.video-reels.price_note',    'per reel', 'services', '', '', 6),
  ('service.website-listing.price',     '₹999',   'services', 'Website Listing — per month', '', 7),
  ('service.website-listing.price_note','per month', 'services', '', '', 8)
on conflict (key) do nothing;

-- ─── track when a setting last changed ───────────────────────────────
create or replace function public.touch_settings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_settings on public.site_settings;
create trigger touch_settings
  before update on public.site_settings
  for each row execute function public.touch_settings_updated_at();