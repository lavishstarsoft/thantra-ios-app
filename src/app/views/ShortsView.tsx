import React, { useState, useEffect, useRef } from "react";
import { getHomeData } from "../actions";
import { IoReloadOutline, IoHeart, IoChatbubbleOutline, IoShareSocialOutline, IoEllipsisVertical, IoPlay } from "react-icons/io5";

export default function ShortsView() {
  const [loading, setLoading] = useState(true);
  const [shorts, setShorts] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getHomeData();
      if (res.success && res.data) {
        setShorts(res.data.shorts);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <IoReloadOutline className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 bg-black overflow-y-scroll snap-y snap-mandatory ios-scrollbar"
    >
      {shorts.map((short, index) => (
        <ShortVideoItem key={short.id} short={short} index={index} rootRef={containerRef} />
      ))}
    </div>
  );
}

function ShortVideoItem({
  short,
  rootRef,
}: {
  short: any;
  index: number;
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play only the short that is scrolled into view; pause the rest.
  useEffect(() => {
    const el = itemRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { root: rootRef.current, threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <div
      ref={itemRef}
      className="w-full h-full snap-start relative flex items-center justify-center bg-gray-900 overflow-hidden ios-clickable"
    >

      {short.videoUrl ? (
        <video
          ref={videoRef}
          src={short.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={false}
          playsInline
          onClick={togglePlay}
          poster={short.thumbnailUrl || undefined}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-800">
           <IoPlay size={48} className="mb-4 opacity-50" />
           <span>Video Not Available</span>
        </div>
      )}

      {/* IoPlay/Pause Overlay Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20">
          <IoPlay size={64} className="text-white/80" fill="currentColor" />
        </div>
      )}

      {/* Right Action Bar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-20">
        <button className="flex flex-col items-center group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mb-1 transition-transform active:scale-90">
            <IoHeart size={24} className="text-white" fill="none" />
          </div>
          <span className="text-white text-[12px] font-medium drop-shadow-md">{short.likes || '1.2k'}</span>
        </button>
        <button className="flex flex-col items-center group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mb-1 transition-transform active:scale-90">
            <IoChatbubbleOutline size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-medium drop-shadow-md">234</span>
        </button>
        <button className="flex flex-col items-center group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mb-1 transition-transform active:scale-90">
            <IoShareSocialOutline size={24} className="text-white" />
          </div>
          <span className="text-white text-[12px] font-medium drop-shadow-md">Share</span>
        </button>
        <button className="flex flex-col items-center">
          <IoEllipsisVertical size={24} className="text-white drop-shadow-md active:opacity-50" />
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute left-4 bottom-4 right-20 z-20">
        <h3 className="text-white font-bold text-[16px] mb-2 drop-shadow-md leading-snug">
          {short.title}
        </h3>
        {short.caption && (
          <p className="text-white/90 text-[13px] line-clamp-2 drop-shadow-md">
            {short.caption}
          </p>
        )}
        {short.linkedVideoTitle && (
          <button className="mt-3 bg-white/20 backdrop-blur-md text-white text-[13px] font-medium px-4 py-1.5 rounded-full border border-white/30 active:bg-white/30">
            View Full Lesson 
          </button>
        )}
      </div>
    </div>
  );
}
