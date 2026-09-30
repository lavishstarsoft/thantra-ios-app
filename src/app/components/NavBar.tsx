"use client";

import React from "react";
import { IoChevronBack, IoMenu } from "react-icons/io5";

interface NavBarProps {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  rightAction?: React.ReactNode;
}

export default function NavBar({ title, showBack = false, showLogo = false, onBack, onMenu, rightAction }: NavBarProps) {
  return (
    <div className="ios-nav-bar flex items-center px-4 relative">
      {showBack ? (
        <button
          className="ios-clickable text-[#007aff] flex items-center absolute left-2 h-full px-2"
          onClick={onBack}
        >
          <IoChevronBack size={26} className="-ml-1" />
          <span className="text-[17px] -ml-0.5">Back</span>
        </button>
      ) : onMenu ? (
        <button
          className="ios-clickable text-gray-800 flex items-center absolute left-3 h-full"
          onClick={onMenu}
          aria-label="Menu"
        >
          <IoMenu size={28} />
        </button>
      ) : null}

      {/* Center: logo on home, title text elsewhere */}
      {showLogo && !showBack ? (
        <div className="flex-1 flex justify-center">
          <img
            src="/thantra-logo.png"
            alt="Thantra Astro"
            className="w-9 h-9 rounded-full object-cover border border-gray-200 bg-black"
          />
        </div>
      ) : (
        <h1 className="ios-nav-title flex-1 text-center truncate px-20">{title}</h1>
      )}

      {rightAction && (
        <div className="absolute right-4 h-full flex items-center">
          {rightAction}
        </div>
      )}
    </div>
  );
}
