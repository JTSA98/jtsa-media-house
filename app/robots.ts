import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://jtsa-media-house.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/login"],
        // Client and staff areas are private — keep them out of search results.
        disallow: ["/portal", "/admin", "/staff-login", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}