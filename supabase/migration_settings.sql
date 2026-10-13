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

  -- hero -----------------------------------------------------------------
  ('hero.badge',  'Durga Puja & Diwali Festive Edition U+2014 now booking', 'hero', 'Festive badge', '', 1),
  ('hero.title_top', 'Single influencers don''t give results.', 'hero', 'Headline, first line', '', 2),
  ('hero.title_gradient', 'We give you a digital creator army + physical ground dominance.', 'hero', 'Headline, gradient line', '', 3),
  ('hero.body', 'Multi-influencer digital swarms paired with high-touch physical pandal, canopy and B2B ground distribution for unmissable market authority.', 'hero', 'Sub-headline', '', 4),
  ('hero.stat_0.value', '360' || U&'\00B0', 'hero', 'Stat 1 value', '', 5),
  ('hero.stat_0.label', 'Regional Funnel', 'hero', '', '', 6),
  ('hero.stat_1.value', '200K+', 'hero', 'Stat 2 value', '', 7),
  ('hero.stat_1.label', 'Views / Campaign', 'hero', '', '', 8),
  ('hero.stat_2.value', '5-7 Touch', 'hero', 'Stat 3 value', '', 9),
  ('hero.stat_2.label', 'Recall Principle', 'hero', '', '', 10),
  ('hero.stat_3.value', '250%', 'hero', 'Stat 4 value', '', 11),
  ('hero.stat_3.label', 'Avg Lead Surge', 'hero', '', '', 12),

  -- why combo ------------------------------------------------------------
  ('whycombo.heading', 'Why most regional campaigns stall out', 'compare', 'Section heading', '', 1),
  ('whycombo.body', 'Traditional single-channel promotions waste budget with negligible walk-ins. Here is how each one breaks down.', 'compare', 'Section intro', '', 2),
  ('compare.single-reel.label', 'Traditional Method 1', 'compare', 'Card 1 label', '', 3),
  ('compare.single-reel.title', 'Single Influencer Reel', 'compare', 'Card 1 title', '', 4),
  ('compare.single-reel.body', '60%+ of their audience lives outside Dhanbad. Followers are fragmented and isolated.', 'compare', 'Card 1 body', '', 5),
  ('compare.single-reel.impact', 'High cost, zero footfall conversions for local stores and schools.', 'compare', 'Card 1 impact', '', 6),
  ('compare.passive-leaflets.label', 'Traditional Method 2', 'compare', 'Card 2 label', '', 7),
  ('compare.passive-leaflets.title', 'Passive Leaflets', 'compare', 'Card 2 title', '', 8),
  ('compare.passive-leaflets.body', 'Distributed without an active pitch or any digital verification anchor.', 'compare', 'Card 2 body', '', 9),
  ('compare.passive-leaflets.impact', '95% material waste, zero trackable customer leads.', 'compare', 'Card 2 impact', '', 10),
  ('compare.social-ads.label', 'Traditional Method 3', 'compare', 'Card 3 label', '', 11),
  ('compare.social-ads.title', 'Uncoordinated Social Ads', 'compare', 'Card 3 title', '', 12),
  ('compare.social-ads.body', 'Generic graphics that lack hyper-local cultural context or creator trust.', 'compare', 'Card 3 body', '', 13),
  ('compare.social-ads.impact', 'Wasted ad spend, easily ignored sponsored posts.', 'compare', 'Card 3 impact', '', 14),
  ('compare.static-flex.label', 'Traditional Method 4', 'compare', 'Card 4 label', '', 15),
  ('compare.static-flex.title', 'Static Billboards / Flex', 'compare', 'Card 4 title', '', 16),
  ('compare.static-flex.body', 'Expensive upfront, entirely passive, with zero digital retargeting capability.', 'compare', 'Card 4 body', '', 17),
  ('compare.static-flex.impact', 'Massive fixed cost with no lead generation analytics.', 'compare', 'Card 4 impact', '', 18),
  ('recall.title', 'The Multi-Touchpoint Recall Principle', 'compare', 'Recall callout title', '', 19),
  ('recall.body', 'A local customer in Dhanbad needs to see a brand at least 5 to 7 times across online reels and physical street touchpoints within 48 hours before making a buying or admission decision.', 'compare', 'Recall callout body', '', 20),

  -- 360 architecture -----------------------------------------------------
  ('solution.subheading', 'The 360' || U&'\00B0 hybrid marketing engine', 'pillars', 'Section heading', '', 1),
  ('solution.body', 'We pair digital creator swarms with high-impact physical ground execution to create total regional dominance.', 'pillars', 'Section intro', '', 2),
  ('pillars.digital.label', 'Pillar 01: Digital Army', 'pillars', 'Pillar 1 label', '', 3),
  ('pillars.digital.title', 'Multi-Creator Swarms', 'pillars', 'Pillar 1 title', '', 4),
  ('pillars.digital.body', '4, 5 and 10 local influencers drop synchronised video content within a tight 48-hour window, overwhelming the local feed to create a genuine viral trend.', 'pillars', 'Pillar 1 body', '', 5),
  ('pillars.digital.points', 'Simultaneous Instagram reels and stories|Co-authoring and hyper-local geo tags|Combined 35K to 200K+ estimated local views', 'pillars', '', 'One per line.', 6),
  ('pillars.physical.label', 'Pillar 02: Ground Trust', 'pillars', 'Pillar 2 label', '', 7),
  ('pillars.physical.title', 'Physical Dominance', 'pillars', 'Pillar 2 title', '', 8),
  ('pillars.physical.body', 'High-visibility physical presence validates online excitement. Strategic pandal banners, promotional canopy hubs and hand-to-hand leaflet drops across prime spots.', 'pillars', 'Pillar 2 body', '', 9),
  ('pillars.physical.points', 'Top Durga Puja pandal gates and LED screens|Canopy hubs at Bank More and City Centre|Targeted school and coaching gate flyer drops', 'pillars', '', 'One per line.', 10),
  ('pillars.conversion.label', 'Pillar 03: Conversion', 'pillars', 'Pillar 3 label', '', 11),
  ('pillars.conversion.title', 'QR Bridge & Footfall', 'pillars', 'Pillar 3 title', '', 12),
  ('pillars.conversion.body', 'Every flyer, standee and banner carries an interactive QR code pointing straight at creator reels, WhatsApp offers and walk-in coupon verification.', 'pillars', 'Pillar 3 body', '', 13),
  ('pillars.conversion.points', 'Instant lead capture and WhatsApp integration|Exclusive JTSA festive VIP coupons|Transparent post-campaign analytics report', 'pillars', '', 'One per line.', 14),

  -- sector playbooks -----------------------------------------------------
  ('sectors.heading', 'Sector-specific execution models', 'sectors', 'Section heading', '', 1),
  ('sectors.body', 'We don''t use generic strategies. Pick your industry to see how the model applies.', 'sectors', 'Section intro', '', 2),
  ('sectors.education.tab', 'Education & Coaching', 'sectors', 'Tab label', '', 3),
  ('sectors.education.title', 'Educational Institutions & Coaching Hubs', 'sectors', 'Education title', '', 4),
  ('sectors.education.subtitle', 'Admission surge model for schools, NEET/JEE coaching and colleges', 'sectors', 'Education subtitle', '', 5),
  ('sectors.education.impact', 'Increases inquiry call volume by an average of 250% during admission cycles.', 'sectors', 'Education impact', '', 6),
  ('sectors.education.rec_digital', '5 to 10 local creators', 'sectors', 'Education recommended', '', 7),
  ('sectors.education.rec_ground', '1,000+ pamphlet drops and standees', 'sectors', 'Education recommended', '', 8),
  ('sectors.education.rec_locations', 'Bank More, City Centre, Saraidhela', 'sectors', 'Education locations', '', 9),
  ('sectors.retail.tab', 'Retail & Showrooms', 'sectors', 'Tab label', '', 10),
  ('sectors.retail.title', 'Retail Showrooms, Fashion & Electronics', 'sectors', 'Retail title', '', 11),
  ('sectors.retail.subtitle', 'Festive shopping blitz for showrooms and megastores', 'sectors', 'Retail subtitle', '', 12),
  ('sectors.retail.impact', 'Drives immediate physical store walk-ins and festive stock clearance.', 'sectors', 'Retail impact', '', 13),
  ('sectors.hospitality.tab', 'Restaurants & Cafes', 'sectors', 'Tab label', '', 14),
  ('sectors.hospitality.title', 'Restaurants, Cafes & Food Outlets', 'sectors', 'Hospitality title', '', 15),
  ('sectors.hospitality.subtitle', 'Food creator swarm and ambience experience engine', 'sectors', 'Hospitality subtitle', '', 16),
  ('sectors.hospitality.impact', 'Routinely yields 10,000+ local views per reel, driving weekend bookings.', 'sectors', 'Hospitality impact', '', 17),
  ('sectors.b2b.tab', 'Real Estate & Health', 'sectors', 'Tab label', '', 18),
  ('sectors.b2b.title', 'Real Estate, Clinics & High-Value B2B', 'sectors', 'B2B title', '', 19),
  ('sectors.b2b.subtitle', 'Trust-building and authoritative lead generation model', 'sectors', 'B2B subtitle', '', 20),
  ('sectors.b2b.impact', 'Captures high-intent verified leads with maximum trustworthiness.', 'sectors', 'B2B impact', '', 21),

  -- festive rollout ------------------------------------------------------
  ('festive.badge', 'Festive grand opening launch', 'festive', 'Badge', '', 1),
  ('festive.heading', 'Durga Puja & Diwali campaign blitz', 'festive', 'Section heading', '', 2),
  ('festive.body', 'Eastern India''s biggest consumer spending window. Capitalise on footfall and festive digital traffic with a structured rollout.', 'festive', 'Section intro', '', 3),
  ('festive.pre-puja.label', 'Phase 1: Pre-Puja Hype', 'festive', 'Phase 1 label', '', 4),
  ('festive.pre-puja.title', 'Saptami to Navami Surge', 'festive', 'Phase 1 title', '', 5),
  ('festive.puja.label', 'Phase 2: On-Ground Pandal Surge', 'festive', 'Phase 2 label', '', 6),
  ('festive.puja.title', 'Puja Live Coverage', 'festive', 'Phase 2 title', '', 7),
  ('festive.diwali.label', 'Phase 3: Dhanteras & Diwali Blitz', 'festive', 'Phase 3 label', '', 8),
  ('festive.diwali.title', 'High-Ticket Purchase Blitz', 'festive', 'Phase 3 title', '', 9),
  ('perks.heading', 'Grand opening inaugural client special', 'festive', 'Perks heading', '', 10),
  ('perks.intro', 'Book any combo before the season starts to receive exclusive launch perks:', 'festive', 'Perks intro', '', 11),
  ('perks.discount.headline', '10% Flat Off', 'festive', 'Perk 1', '', 12),
  ('perks.discount.body', 'Early-bird discount on the Silver and Gold combo packages.', 'festive', 'Perk 1 detail', '', 13),
  ('perks.flyers.headline', 'Free 1,000 Flyers', 'festive', 'Perk 2', '', 14),
  ('perks.flyers.body', 'Complimentary festive pandal leaflet distribution included.', 'festive', 'Perk 2 detail', '', 15),
  ('perks.reel.headline', 'Launch Reel Slot', 'festive', 'Perk 3', '', 16),
  ('perks.reel.body', 'Featured spot in the JTSA official opening broadcast across handles.', 'festive', 'Perk 3 detail', '', 17),

  -- ROI calculator bases -------------------------------------------------
  ('calc.heading', 'Campaign ROI & reach estimator', 'calculator', 'Section heading', '', 1),
  ('calc.body', 'Simulate your estimated local reach, physical touchpoints and expected lead potential based on the package and intensity you pick.', 'calculator', 'Section intro', '', 2),
  ('calc.note', 'Estimates are modelled from regional campaign benchmarks and are indicative, not guaranteed.', 'calculator', 'Disclaimer', '', 3),
  ('calc.intensity_labels', 'Single Weekend Push|Festive 3-Day Blitz|10-Day Festival Dominance', 'calculator', 'Slider labels', 'Must be 3 entries.', 4),
  ('calc.silver.views', '35000', 'calculator', 'Silver base views', '', 5),
  ('calc.silver.flyers', '500', 'calculator', 'Silver base flyers', '', 6),
  ('calc.silver.creators', '4 Creators', 'calculator', 'Silver creators', '', 7),
  ('calc.silver.leads_low', '40', 'calculator', 'Silver leads low', '', 8),
  ('calc.silver.leads_high', '90', 'calculator', 'Silver leads high', '', 9),
  ('calc.silver.score', '6.5', 'calculator', 'Silver base score', '', 10),
  ('calc.gold.views', '80000', 'calculator', 'Gold base views', '', 11),
  ('calc.gold.flyers', '1000', 'calculator', 'Gold base flyers', '', 12),
  ('calc.gold.creators', '5 Creators', 'calculator', 'Gold creators', '', 13),
  ('calc.gold.leads_low', '100', 'calculator', 'Gold leads low', '', 14),
  ('calc.gold.leads_high', '220', 'calculator', 'Gold leads high', '', 15),
  ('calc.gold.score', '7.8', 'calculator', 'Gold base score', '', 16),
  ('calc.platinum.views', '200000', 'calculator', 'Platinum base views', '', 17),
  ('calc.platinum.flyers', '2500', 'calculator', 'Platinum base flyers', '', 18),
  ('calc.platinum.creators', '10 Creators', 'calculator', 'Platinum creators', '', 19),
  ('calc.platinum.leads_low', '250', 'calculator', 'Platinum leads low', '', 20),
  ('calc.platinum.leads_high', '500', 'calculator', 'Platinum leads high', '', 21),
  ('calc.platinum.score', '8.9', 'calculator', 'Platinum base score', '', 22),
  ('calc.vip.views', '500000', 'calculator', 'VIP base views', '', 23),
  ('calc.vip.flyers', '5000', 'calculator', 'VIP base flyers', '', 24),
  ('calc.vip.creators', 'Dedicated Network', 'calculator', 'VIP creators', '', 25),
  ('calc.vip.score', '10', 'calculator', 'VIP base score', '', 26),

  -- booking --------------------------------------------------------------
  ('booking.kicker', 'Official registration', 'general', 'Booking label', '', 30),
  ('booking.heading', 'Book your campaign slot', 'general', 'Booking heading', '', 31),
  ('booking.body', 'Festive demand is high, so creator combo slots are capped per zone to prevent audience saturation. Secure your slot now.', 'general', 'Booking intro', '', 32),
  ('booking.sla', 'Quality assurance SLA', 'general', 'SLA label', '', 33),

  -- lead notifications ---------------------------------------------------
  -- Where campaign bookings and other lead emails are delivered. Overrides
  -- ADMIN_NOTIFY_EMAIL / BREVO_SENDER_EMAIL in .env.local, so the owner can
  -- change the receiving inbox from /admin/settings without a redeploy.
  ('notify.admin_email', 'jtsaofficial@gmail.com', 'notify', 'Send new leads to', 'Every booking from the homepage form is emailed here as well as saved to the enquiries table.', 1),
  ('notify.new_enquiry', 'true', 'notify', 'Email me on new bookings', 'false still saves the lead to the admin panel, it just does not email you.', 2),

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