import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt — allow all crawlers on all routes and point to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
