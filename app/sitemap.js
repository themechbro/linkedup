export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const homeUrl = "http://localhost:3000/home";
export default function sitemap() {
  return [
    {
      url: [siteUrl, homeUrl],
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
