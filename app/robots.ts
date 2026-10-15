import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://jtsamediahouse.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/login"],
        // Client and staff areas are private — keep them out of search results.
        // /admin/login moved out of /staff-login, so it needs naming here too.
        disallow: [
          "/portal",
          "/admin",
          "/staff-login",
          "/api/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}