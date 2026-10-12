-- ======================================================================
--  Migration ? site settings
--
--  A key/value table so the whole site can be edited from /admin/settings
--  without touching code. Same pattern as the Olympiad site's site_settings.
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run ? existing keys are updated, not duplicated.
-- ======================================================================

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

-- --- seed defaults ---------------------------------------------------
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

  -- portal visibility -------------------------------------------------
  ('portal.client_login', 'false', 'general', 'Show client login links', 'true shows Client Login in the nav and Client Portal in the footer. Routes stay live either way.', 1),

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
  ('price.flex',    U&'\20B935 / sq.ft', 'prices', 'Flex printing', 'Design included.', 1),
  ('price.flex_note',    'Flex printing, design included', 'prices', '', '', 2),
  ('price.standee', U&'\20B91,799',       'prices', 'Roll-up standee', 'With design.', 3),
  ('price.standee_note', 'Roll-up standee with design', 'prices', '', '', 4),
  ('price.poster',  U&'\20B9499',         'prices', 'Poster design + print', '', 5),
  ('price.poster_note', U&'Poster \2014 design + print', 'prices', '', '', 6),
  ('price.shoot',   U&'\20B914,999',      'prices', 'Half-day event shoot', '', 7),
  ('price.shoot_note', 'Half-day event shoot', 'prices', '', '', 8),

  -- creator combo tiers + standalone pass + offline rate card ----------
  -- Keyed on plan.<id>.* where id is stable (silver/gold/platinum/vip),
  -- so renaming a tier in the admin panel never orphans its price row.
  ('plan.silver.name',     '4-Influencer Silver Combo', 'plans', U&'Silver \2014 name', '', 1),
  ('plan.silver.price',    '14,999',   'plans', U&'Silver \2014 price', 'Digits only.', 2),
  ('plan.silver.tagline',  'Cafes, boutiques, coaching batches', 'plans', U&'Silver \2014 audience', '', 3),
  ('plan.silver.features', U&'4 micro local creators (5K\201320K)|4 dedicated Instagram reels|8 promotional stories with tags|~35,000 estimated local reach', 'plans', '', 'One per line.', 4),
  ('plan.silver.physical', '500 B2B leaflets|1 standee banner', 'plans', '', 'One per line.', 5),

  ('plan.gold.name',     '5-Influencer Gold Growth Pack', 'plans', U&'Gold \2014 name', '', 6),
  ('plan.gold.price',    '24,999',   'plans', U&'Gold \2014 price', 'Digits only.', 7),
  ('plan.gold.tagline',  'Schools, jewellery, retail showrooms', 'plans', U&'Gold \2014 audience', '', 8),
  ('plan.gold.features', U&'5 mid-tier local creators (10K\201350K)|5 cinematic reels + co-authoring|10 stories with direct link tags|~80,000 estimated local reach', 'plans', '', 'One per line.', 9),
  ('plan.gold.physical', '1,000 leaflets|2 premium standees', 'plans', '', 'One per line.', 10),
  ('plan.gold.badge',    'Most Popular', 'plans', U&'Gold \2014 badge', 'Leave blank for none.', 11),

  ('plan.platinum.name',     '10-Influencer Platinum Swarm', 'plans', U&'Platinum \2014 name', '', 12),
  ('plan.platinum.price',    '49,999',   'plans', U&'Platinum \2014 price', 'Digits only.', 13),
  ('plan.platinum.tagline',  'Grand openings and mega sales', 'plans', U&'Platinum \2014 audience', '', 14),
  ('plan.platinum.features', '10 regional mixed-tier creators|10 simultaneous reel drops|20 stories + live on-site coverage|~200,000 estimated local reach', 'plans', '', 'One per line.', 15),
  ('plan.platinum.physical', '2,500 leaflets|Durga pandal slot', 'plans', '', 'One per line.', 16),

  ('plan.vip.name',     'VIP Premium Annual Membership', 'plans', U&'VIP \2014 name', '', 17),
  ('plan.vip.price',    '1,19,999', 'plans', U&'VIP \2014 price', 'Digits only.', 18),
  ('plan.vip.tagline',  'Established institutions, yearly umbrella', 'plans', U&'VIP \2014 audience', '', 19),
  ('plan.vip.features', '4 combo campaigns a year (1 per quarter)|Dedicated videographer and scriptwriter|Permanent standee in 10+ partner hubs|5,000 yearly direct leaflet drops', 'plans', '', 'One per line.', 20),
  ('plan.vip.physical', 'Year-round ground presence', 'plans', '', 'One per line.', 21),
  ('plan.vip.badge',    '15 Slots Only', 'plans', U&'VIP \2014 badge', 'Leave blank for none.', 22),

  -- standalone annual membership pass ----------------------------------
  ('vip.pass_price',   '999',  'plans', 'VIP pass price', 'Standalone annual membership pass.', 23),
  ('vip.pass_benefit', 'Flat 20% off every individual combo and offline order for 365 days', 'plans', 'VIP pass benefit', '', 24),

  -- offline / ground add-on rates --------------------------------------
  ('offline.leaflets.rate',  U&'\20B9300 \2013 \20B9450', 'prices', 'Leaflet dropping rate', 'Per 1,000 copies.', 9),
  ('offline.newspaper.rate', U&'\20B9250 \2013 \20B9350', 'prices', 'Newspaper insert rate', 'Per 1,000 copies.', 10),
  ('offline.flex.rate',      U&'\20B912 \2013 \20B918',  'prices', 'Flex pasting rate', 'Per sq. ft.', 11),
  ('offline.auto.rate',      U&'\20B9150 \2013 \20B9250', 'prices', 'Auto branding rate', 'Per auto / month.', 12),
  ('offline.hoardings.rate', U&'\20B9450 \2013 \20B9800', 'prices', 'Hoarding rate', 'Per banner.', 13),

  -- budget bands (registration form + pipeline estimates) -----------
  ('budget.bands', U&'Under \20B95,000|\20B95,000 \2014 \20B910,000|\20B910,000 \2014 \20B925,000|\20B925,000 \2014 \20B950,000|Above \20B950,000|Not sure yet', 'budgets', 'Budget bands', 'One option per line. Keep parallel with the values below.', 1),
  ('budget.mids', '5000|10000|25000|50000|100000|0', 'budgets', 'Band values (₹)', 'Pipeline rupee value per band, same order, one per line.', 2),

  -- online payment --------------------------------------------------
  ('pay.flex_advance', '500', 'payments', U&'Flex advance (\20B9)', 'Flat online advance for flex work, which is otherwise priced per sq.ft. Digits only.', 5),

  -- services ----------------------------------------------------------
  ('service.posters-banners.price',     U&'\20B9299',   'services', U&'Posters & Banners \2014 from', '', 1),
  ('service.posters-banners.price_note','from, per design', 'services', '', '', 2),
  ('service.social-campaigns.price',    U&'\20B94,999', 'services', U&'Social Campaigns \2014 per month', '', 3),
  ('service.social-campaigns.price_note','per month', 'services', '', '', 4),
  ('service.video-reels.price',         U&'\20B94,999', 'services', U&'Video & Reels \2014 per reel', '', 5),
  ('service.video-reels.price_note',    'per reel', 'services', '', '', 6),
  ('service.website-listing.price',     U&'\20B9999',   'services', U&'Website Listing \2014 per month', '', 7),
  ('service.website-listing.price_note','per month', 'services', '', '', 8)
on conflict (key) do nothing;

-- --- retire the superseded monthly retainer rows -----------------------
-- Starter / Scale / Premium were monthly retainers. The site now sells
-- creator combo tiers keyed plan.silver|gold|platinum|vip. Left in place
-- these dead rows would still render in the admin settings form.
delete from public.site_settings where key in (
  'plan.starter.name','plan.starter.price','plan.starter.features',
  'plan.growth.name','plan.growth.price','plan.growth.features','plan.growth.badge',
  'plan.premium.name','plan.premium.price','plan.premium.features'
);

-- --- track when a setting last changed -------------------------------
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