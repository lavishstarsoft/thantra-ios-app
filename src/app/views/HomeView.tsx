import React, { useState, useEffect } from "react";
import ShortVideoCard from "../components/ShortVideoCard";
import CategoryPill from "../components/CategoryPill";
import {
  IoSparkles,
  IoMoon,
  IoSunny,
  IoBook,
  IoChevronForward,
  IoChevronBack,
  IoStar,
} from "react-icons/io5";
import { getHomeData } from "../actions";
import { useSession, getToken } from "../lib/session";

interface HomeViewProps {
  onNavigateToCourse: (courseId: string) => void;
  onRequireLogin?: () => void;
  onOpenShorts?: () => void;
}

interface ContinueItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  pct: number;
}

// Mirrors the Android/Flutter home: banner → categories → recommended →
// quick lessons (shorts) → per-category rails → upcoming, all in iOS style.
export default function HomeView({ onNavigateToCourse, onRequireLogin, onOpenShorts }: HomeViewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    carousel: [],
    categories: [],
    videos: [],
    recommended: [],
    shorts: [],
    upcoming: [],
  });
  const { token, isLoggedIn } = useSession();
  const [continueWatching, setContinueWatching] = useState<ContinueItem[]>([]);
  const [slide, setSlide] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [seeAll, setSeeAll] = useState<{ title: string; items: any[] } | null>(null);

  const onCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== slide) setSlide(idx);
  };

  // Carousel tap: video → open course; url → open link; else match title → open.
  const onBannerClick = (item: any) => {
    const target = (item.target || "").trim();
    if (item.kind === "url" && target) {
      window.open(target, "_blank");
      return;
    }
    if (target) {
      const v = (data.videos || []).find((x: any) => x.title === target);
      if (v) onNavigateToCourse(v.id);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getHomeData();
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    })();
  }, []);

  // Real "Continue Watching": pull the signed-in user's progress and match it
  // against the loaded videos so we get thumbnails + a progress bar.
  useEffect(() => {
    const videos = data.videos;
    if (!token || !videos || videos.length === 0) {
      setContinueWatching([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/progress/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const items: ContinueItem[] = (json.progress || [])
          .map((p: any) => {
            const v = videos.find((x: any) => x.title === p.videoTitle);
            if (!v) return null;
            const pct = p.duration > 0 ? Math.min(1, p.currentTime / p.duration) : 0;
            if (pct <= 0.01 || pct >= 0.98) return null; // skip not-started / finished
            return { id: v.id, title: v.title, thumbnailUrl: v.thumbnailUrl, pct };
          })
          .filter(Boolean)
          .slice(0, 10);
        if (!cancelled) setContinueWatching(items);
      } catch {
        /* offline / ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, data.videos]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-t-3xl mt-2">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#007aff] rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Thantra Astro...</p>
      </div>
    );
  }

  const getCategoryIcon = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("astro")) return <IoSparkles size={14} />;
    if (n.includes("vastu")) return <IoMoon size={14} />;
    if (n.includes("palm")) return <IoSunny size={14} />;
    return <IoBook size={14} />;
  };

  const slides = data.carousel?.length > 0 ? data.carousel : [];
  const visibleCategories = (data.categories || []).filter(
    (c: any) => (c.name || "").trim().toLowerCase() !== "general"
  );

  return (
    <div className="flex-1 overflow-y-auto pb-[100px] bg-white rounded-t-3xl mt-2 shadow-sm">
      <div className="safe-area-pb">
        {/* Banner carousel — full-width horizontal snap scroll */}
        {slides.length > 0 ? (
          <div className="pt-4 pb-1">
            <div
              ref={carouselRef}
              onScroll={onCarouselScroll}
              className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {slides.map((item: any, i: number) => (
                <div key={item.id || i} className="snap-center shrink-0 w-full px-4">
                  <div
                    onClick={() => onBannerClick(item)}
                    className="rounded-2xl overflow-hidden shadow-md relative aspect-[16/9] bg-gradient-to-r from-indigo-500 to-purple-600 ios-clickable cursor-pointer"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title || "banner"} />
                    ) : (
                      <div className="p-5 text-white relative z-10 h-full flex flex-col justify-center">
                        <h2 className="text-xl font-bold mb-1">{item.title || "Learn Astrology"}</h2>
                        <p className="text-sm text-indigo-100 opacity-90">Master the stars from expert gurus.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Dots */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2.5">
                {slides.map((_: any, i: number) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-4 bg-[#007aff]" : "w-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pt-4 pb-1">
            <div className="rounded-2xl overflow-hidden shadow-md relative aspect-[16/9] bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="p-5 text-white relative z-10 h-full flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-1">Learn Astrology</h2>
                <p className="text-sm text-indigo-100 opacity-90">Master the stars from expert gurus.</p>
              </div>
            </div>
          </div>
        )}

        {/* Category pills */}
        {visibleCategories.length > 0 && (
          <div className="px-4 py-2">
            <div className="flex overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4">
              {visibleCategories.map((cat: any) => (
                <CategoryPill
                  key={cat.id}
                  label={cat.name}
                  icon={getCategoryIcon(cat.name)}
                  isActive={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Continue Watching (real progress, only when signed in) */}
        {isLoggedIn && continueWatching.length > 0 && (
          <Section title="Continue Watching">
            <Rail>
              {continueWatching.map((c) => (
                <div
                  key={c.id}
                  className="w-[200px] mr-3 flex-shrink-0 ios-clickable"
                  onClick={() => onNavigateToCourse(c.id)}
                >
                  <div className="aspect-video rounded-[14px] overflow-hidden bg-gray-100 relative">
                    {c.thumbnailUrl ? (
                      <img src={c.thumbnailUrl} className="w-full h-full object-cover" alt={c.title} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-400" />
                    )}
                    {/* progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                      <div
                        className="h-full bg-[#007aff]"
                        style={{ width: `${Math.round(c.pct * 100)}%` }}
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-[14px] text-gray-900 mt-2 leading-tight line-clamp-2">
                    {c.title}
                  </h4>
                  <span className="text-[12px] text-gray-500">{Math.round(c.pct * 100)}% watched</span>
                </div>
              ))}
            </Rail>
          </Section>
        )}

        {/* Recommended */}
        {data.recommended?.length > 0 && (
          <Section title="Recommended" onSeeAll={() => setSeeAll({ title: "Recommended", items: data.recommended })}>
            <Rail>
              {data.recommended.map((v: any) => (
                <MiniCard
                  key={v.id}
                  title={v.title}
                  price={v.priceLabel}
                  rating={v.rating}
                  image={v.thumbnailUrl}
                  onClick={() => onNavigateToCourse(v.id)}
                />
              ))}
            </Rail>
          </Section>
        )}

        {/* Quick Lessons (shorts) */}
        {data.shorts?.length > 0 && (
          <Section title="Quick Lessons">
            <Rail>
              {data.shorts.map((s: any) => (
                <ShortVideoCard
                  key={s.id}
                  title={s.title}
                  views={`${(s.views / 1000).toFixed(1)}K`}
                  thumbnailUrl={s.thumbnailUrl}
                  onClick={() => onOpenShorts?.()}
                />
              ))}
            </Rail>
          </Section>
        )}

        {/* Per-category rails — include General's videos, just relabel the heading */}
        {data.categories.map((cat: any) => {
          const vids = data.videos.filter((v: any) => v.category?.name === cat.name);
          if (vids.length === 0) return null;
          const railTitle =
            (cat.name || "").trim().toLowerCase() === "general" ? "Lessons" : cat.name;
          return (
            <Section key={cat.id} title={railTitle} onSeeAll={() => setSeeAll({ title: railTitle, items: vids })}>
              <Rail>
                {vids.map((v: any) => (
                  <MiniCard
                    key={v.id}
                    title={v.title}
                    price={v.priceLabel}
                    rating={v.rating}
                    image={v.thumbnailUrl}
                    onClick={() => onNavigateToCourse(v.id)}
                  />
                ))}
              </Rail>
            </Section>
          );
        })}

        {/* Safety net: any videos whose category isn't in the category list
            (null / orphaned) still get shown so nothing goes missing. */}
        {(() => {
          const catNames = (data.categories || []).map((c: any) => c.name);
          const orphans = (data.videos || []).filter(
            (v: any) => !v.category || !catNames.includes(v.category.name)
          );
          if (orphans.length === 0) return null;
          return (
            <Section title="All Lessons" onSeeAll={() => setSeeAll({ title: "All Lessons", items: orphans })}>
              <Rail>
                {orphans.map((v: any) => (
                  <MiniCard
                    key={v.id}
                    title={v.title}
                    price={v.priceLabel}
                    rating={v.rating}
                    image={v.thumbnailUrl}
                    onClick={() => onNavigateToCourse(v.id)}
                  />
                ))}
              </Rail>
            </Section>
          );
        })()}

        {/* Upcoming */}
        {data.upcoming?.length > 0 && (
          <Section title="Upcoming">
            <Rail>
              {data.upcoming.map((u: any) => (
                <div key={u.id} className="w-[220px] mr-3 flex-shrink-0 ios-clickable">
                  <div className="aspect-video rounded-[14px] overflow-hidden bg-gray-100 relative">
                    {u.imageUrl ? (
                      <img src={u.imageUrl} className="w-full h-full object-cover" alt={u.title} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-400 to-orange-500" />
                    )}
                    {u.releaseDate && (
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">
                        {u.releaseDate}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-[14px] text-gray-900 mt-2 line-clamp-1">{u.title}</h4>
                  {u.subtitle && <p className="text-[12px] text-gray-500 line-clamp-1">{u.subtitle}</p>}
                </div>
              ))}
            </Rail>
          </Section>
        )}
      </div>

      {/* See All — full vertical list (like the Flutter category screen) */}
      {seeAll && (
        <div className="fixed inset-0 z-[80] bg-white flex flex-col ios-push-in">
          <div className="ios-nav-bar flex items-center px-4 relative">
            <button
              className="ios-clickable text-[#007aff] flex items-center absolute left-2 h-full px-2"
              onClick={() => setSeeAll(null)}
            >
              <IoChevronBack size={26} className="-ml-1" />
              <span className="text-[17px] -ml-0.5">Back</span>
            </button>
            <h1 className="ios-nav-title flex-1 text-center truncate px-20">{seeAll.title}</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 safe-area-pb">
            {seeAll.items.map((v: any) => {
              const label = (v.priceLabel || "").trim();
              const showPrice = label && !["free", "premium"].includes(label.toLowerCase());
              return (
                <div
                  key={v.id}
                  className="flex items-center mb-3 ios-clickable active:bg-gray-50 rounded-2xl"
                  onClick={() => {
                    setSeeAll(null);
                    onNavigateToCourse(v.id);
                  }}
                >
                  <div className="w-32 aspect-video rounded-[12px] overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} className="w-full h-full object-cover" alt={v.title} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-400" />
                    )}
                  </div>
                  <div className="flex-1 ml-3 min-w-0">
                    <h4 className="font-semibold text-[15px] text-gray-900 leading-tight line-clamp-2">
                      {v.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      {typeof v.rating === "number" && v.rating > 0 && (
                        <span className="flex items-center text-[13px] text-gray-600">
                          <IoStar size={12} color="#FFB800" className="mr-0.5" />
                          {v.rating}
                        </span>
                      )}
                      {showPrice && <span className="text-[#007aff] font-bold text-[14px]">{label}</span>}
                    </div>
                  </div>
                  <IoChevronForward size={18} className="text-gray-300 ml-2 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  onSeeAll,
}: {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
}) {
  return (
    <div className="pt-3 pb-1">
      <div className="px-4 flex justify-between items-center mb-2">
        <h3 className="font-bold text-[19px] text-gray-900 tracking-tight">{title}</h3>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-[#007aff] text-[14px] font-medium ios-clickable flex items-center"
          >
            See All <IoChevronForward size={13} className="ml-0.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Rail({ children }: { children: React.ReactNode }) {
  return <div className="flex overflow-x-auto hide-scrollbar pl-4">{children}</div>;
}

function MiniCard({
  title,
  price,
  rating,
  image,
  onClick,
}: {
  title: string;
  price?: string;
  rating?: number;
  image?: string;
  onClick: () => void;
}) {
  return (
    <div className="w-[160px] mr-3 flex-shrink-0 ios-clickable" onClick={onClick}>
      <div className="aspect-video rounded-[14px] overflow-hidden bg-gray-100 relative">
        {image ? (
          <img src={image} className="w-full h-full object-cover" alt={title} />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-400" />
        )}
      </div>
      <h4 className="font-semibold text-[14px] text-gray-900 mt-2 leading-tight line-clamp-2">{title}</h4>
      <div className="flex items-center justify-between mt-1">
        {(() => {
          const label = (price || "").trim();
          const show = label && !["free", "premium"].includes(label.toLowerCase());
          return show ? (
            <span className="text-[#007aff] font-bold text-[14px]">{label}</span>
          ) : (
            <span />
          );
        })()}
        {typeof rating === "number" && rating > 0 && (
          <span className="flex items-center text-[12px] text-gray-600">
            <IoStar size={11} color="#FFB800" className="mr-0.5" />
            {rating}
          </span>
        )}
      </div>
    </div>
  );
}
