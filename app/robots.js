// Тиждень 13: robots.txt через Next.js convention
// Доступний за /robots.txt у production

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
