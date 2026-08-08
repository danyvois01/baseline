import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml — all public routes with crawl hints.
 * Rankings pages update often (live data); legal pages rarely change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/live`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/official`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/race`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
