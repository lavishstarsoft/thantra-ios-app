import React from "react";
import { IoStar, IoTimeOutline } from "react-icons/io5";

interface CourseCardProps {
  title: string;
  category: string;
  price: string;
  rating: string;
  duration: string;
  imageUrl: string;
  onClick: () => void;
}

export default function CourseCard({ title, category, price, rating, duration, imageUrl, onClick }: CourseCardProps) {
  return (
    <div 
      className="bg-white rounded-[16px] shadow-sm mb-4 overflow-hidden ios-clickable active:bg-gray-50 transition-colors border border-gray-100"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-100 relative w-full overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" alt={title} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-indigo-400"></div>
        )}
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-[17px] leading-tight text-gray-900 mb-2 line-clamp-2">{title}</h3>
        
        <div className="flex items-center text-gray-500 text-[13px] mb-3 space-x-3">
          <div className="flex items-center">
            <IoStar size={13} color="#FFB800" className="mr-1" />
            <span className="font-medium text-gray-700">{rating}</span>
          </div>
          <div className="flex items-center">
            <IoTimeOutline size={14} className="mr-1" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-[#007aff] font-bold text-lg">
            {["free", "premium"].includes((price || "").trim().toLowerCase()) ? "" : price}
          </span>
          <button className="bg-[#f2f2f7] text-[#007aff] font-semibold text-[13px] px-4 py-1.5 rounded-full">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
