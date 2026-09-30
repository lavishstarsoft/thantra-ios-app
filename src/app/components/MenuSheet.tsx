"use client";

import React from "react";
import {
  IoHomeOutline,
  IoGridOutline,
  IoPlayCircleOutline,
  IoLibraryOutline,
  IoPersonOutline,
  IoClose,
  IoChevronForward,
} from "react-icons/io5";

interface MenuSheetProps {
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

const ITEMS: { tab: string; label: string; icon: React.ReactNode }[] = [
  { tab: "home", label: "Home", icon: <IoHomeOutline size={22} /> },
  { tab: "categories", label: "Categories", icon: <IoGridOutline size={22} /> },
  { tab: "shorts", label: "Quick Lessons", icon: <IoPlayCircleOutline size={22} /> },
  { tab: "my-courses", label: "My Learning", icon: <IoLibraryOutline size={22} /> },
  { tab: "profile", label: "Profile", icon: <IoPersonOutline size={22} /> },
];

export default function MenuSheet({ onClose, onNavigate }: MenuSheetProps) {
  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Left slide-in panel */}
      <div className="absolute top-0 left-0 h-full w-[78%] max-w-[320px] bg-white shadow-2xl flex flex-col ios-menu-in">
        {/* Header */}
        <div className="pt-[env(safe-area-inset-top,20px)] px-5 pb-5 bg-gradient-to-b from-[#f7f7fb] to-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-4 pt-3">
            <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
            <button className="ios-clickable text-gray-400" onClick={onClose} aria-label="Close">
              <IoClose size={26} />
            </button>
          </div>
          <div className="flex items-center">
            <img
              src="/thantra-logo.png"
              alt="Thantra Astro"
              className="w-14 h-14 rounded-full object-cover border border-gray-200 bg-black"
            />
            <div className="ml-3">
              <h2 className="text-[19px] font-bold text-gray-900 leading-tight">Thantra Astro</h2>
              <p className="text-[13px] text-gray-500">Learn Astrology</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto py-2">
          {ITEMS.map((it) => (
            <button
              key={it.tab}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
              onClick={() => {
                onNavigate(it.tab);
                onClose();
              }}
            >
              <div className="flex items-center">
                <span className="text-[#007aff] mr-4">{it.icon}</span>
                <span className="text-[17px] font-medium text-gray-900">{it.label}</span>
              </div>
              <IoChevronForward size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
