import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/customer/dashboard", "/cook/dashboard", "/api/"],
      },
    ],
    sitemap: "https://homefeast.in/sitemap.xml",
  };
}
