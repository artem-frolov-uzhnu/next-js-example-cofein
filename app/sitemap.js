// Тиждень 13: sitemap.xml через Next.js convention
// Доступний за /sitemap.xml у production

import dbConnect from "@/lib/db";
import Drink from "@/lib/models/Drink";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/menu`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Динамічні маршрути напоїв з БД
  let drinkRoutes = [];
  try {
    await dbConnect();
    const drinks = await Drink.find({ available: true }).select("_id updatedAt").lean();
    drinkRoutes = drinks.map((d) => ({
      url: `${siteUrl}/menu/${d._id}`,
      lastModified: d.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Якщо БД недоступна під час білда — повертаємо лише статичні маршрути.
  }

  return [...staticRoutes, ...drinkRoutes];
}
