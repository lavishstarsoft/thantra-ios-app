import React from "react";
import { IoPlay } from "react-icons/io5";

interface ShortVideoCardProps {
  title: string;
  views: string;
  thumbnailUrl?: string;
  onClick: () => void;
}

export default function ShortVideoCard({ title, views, thumbnailUrl, onClick }: ShortVideoCardProps) {
  return (
    <div
      className="relative w-[140px] h-[220px] rounded-[16px] overflow-hidden flex-shrink-0 ios-clickable mr-3"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black"></div>
      {thumbnailUrl ? (
        <img src={thumbnailUrl} className="absolute inset-0 w-full h-full object-cover" alt={title} />
      ) : null}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
      
      <div className="absolute top-2 right-2 text-white/90 text-[11px] font-medium flex items-center bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
        <IoPlay size={11} className="mr-1" />
        {views}
      </div>
      
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <h4 className="font-semibold text-[13px] leading-snug line-clamp-2">{title}</h4>
      </div>
    </div>
  );
}
