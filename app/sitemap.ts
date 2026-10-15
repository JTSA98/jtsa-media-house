import type { MetadataRoute } from "next";

/* NEXT_PUBLIC_SITE_URL should be set in Vercel. The fallback is the real
   domain rather than the vercel.app address, so an unset variable never
   publishes canonical URLs to a deployment URL. */
const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://jtsamediahouse.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // /staff-login used to be listed here. It now only redirects to
    // /admin/login, which must never be indexed.
  ];
}