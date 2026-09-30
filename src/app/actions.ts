"use server";

// Standalone data layer: instead of talking to the DB directly, we fetch the
// dashboard's public API on the server (no CORS, secrets stay on the dashboard).

const API_BASE = (process.env.API_BASE || "http://localhost:3000").replace(/\/$/, "");

function abs(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getJson(path: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetch failed", path, e);
    return null;
  }
}

export async function getHomeData() {
  try {
    const [catalog, shortsRes, upcomingRes] = await Promise.all([
      getJson("/api/public/catalog"),
      getJson("/api/public/shorts"),
      getJson("/api/public/upcoming"),
    ]);

    if (!catalog) return { success: false, error: "Catalog unavailable" };

    const catalogMap: Record<string, any> = catalog.catalog || {};

    // All videos (id = title in the standalone).
    const videos = Object.values(catalogMap).map((v: any) => ({
      id: v.title,
      title: v.title,
      thumbnailUrl: abs(v.thumbnailUrl),
      priceLabel: v.priceLabel,
      rating: v.rating,
      category: { name: v.category },
    }));

    // Categories from videosByCategory keys.
    const catThumbs: Record<string, string> = catalog.categoryThumbnailUrlByName || {};
    const categories = Object.keys(catalog.videosByCategory || {}).map((name) => ({
      id: name,
      name,
      thumbnailUrl: abs(catThumbs[name]),
    }));

    // Recommended: configured titles, else first few.
    const recTitles: string[] = catalog.homeConfig?.recommendedVideoTitles || [];
    const byTitle = new Map(videos.map((v) => [v.title, v]));
    const recommended =
      recTitles.length > 0
        ? recTitles.map((t) => byTitle.get(t)).filter(Boolean)
        : videos.slice(0, 8);

    // Shorts.
    const shorts = (shortsRes?.shorts || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      thumbnailUrl: abs(s.thumbnail),
      videoUrl: abs(s.videoUrl),
      caption: s.caption,
      linkedVideoTitle: s.linkedVideoTitle,
      views: 0,
    }));

    // Upcoming.
    const upcoming = (Array.isArray(upcomingRes) ? upcomingRes : []).map((u: any) => ({
      id: u.id,
      title: u.title,
      subtitle: u.subtitle,
      imageUrl: abs(u.imageUrl),
      releaseDate: u.releaseDate,
    }));

    return {
      success: true,
      data: {
        carousel: (catalog.carouselItems || []).map((c: any, i: number) => ({
          id: String(i),
          imageUrl: abs(c.imageUrl),
          title: c.title,
          kind: c.kind,
          target: c.target,
        })),
        categories,
        videos,
        recommended,
        shorts,
        upcoming,
        buyButtonText: catalog.homeConfig?.buyButtonText ?? "Enroll Now",
      },
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getCourseDetails(videoId: string) {
  try {
    // videoId is the title in the standalone app.
    const catalog = await getJson("/api/public/catalog");
    const v = catalog?.catalog?.[videoId];
    if (!v) return { success: false, error: "Not found" };

    return {
      success: true,
      data: {
        title: v.title,
        description: v.description,
        duration: v.duration,
        lessons: v.lessons,
        rating: v.rating,
        priceLabel: v.priceLabel,
        isFree: v.isFree,
        accessValidityDays: v.accessValidityDays,
        thumbnailUrl: abs(v.thumbnailUrl),
        hlsUrl: v.hlsUrl || "",
        dashUrl: v.dashUrl || "",
        category: { name: v.category },
        checkoutAmountCents: v.pricingTiers?.[0]?.amountCents ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching course data:", error);
    return { success: false, error: "Failed to fetch course details" };
  }
}
