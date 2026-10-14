import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://homefeast.in";
  const now = new Date();

  const routes = [
    "",
    "/search",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/refund",
    "/cookies",
    "/fssai",
    "/login",
    "/register",
    "/cook/register",
    "/cooks/c1",
    "/cooks/c2",
    "/cooks/c3",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/search" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/cooks") || route === "/search" ? 0.9 : 0.7,
  }));
}
