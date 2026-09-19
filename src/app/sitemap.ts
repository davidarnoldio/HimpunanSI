import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://himsigundar.vercel.app";
  const currentDate = new Date();

  // Operational Division Slugs
  const divisions = ["internal", "humas", "pendidikan", "medinfo"];

  const divisionEntries: MetadataRoute.Sitemap = divisions.map((slug) => ({
    url: `${baseUrl}/divisi/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/aspirasi`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/merchandise`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...divisionEntries,
  ];
}
