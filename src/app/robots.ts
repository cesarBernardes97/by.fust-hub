import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/painel", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://byfust.com.br/sitemap.xml",
  };
}
