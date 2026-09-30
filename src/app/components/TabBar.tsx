"use client";

import React from "react";
import {
  IoHome,
  IoHomeOutline,
  IoGrid,
  IoGridOutline,
  IoPlayCircle,
  IoPlayCircleOutline,
  IoLibrary,
  IoLibraryOutline,
  IoPerson,
  IoPersonOutline,
} from "react-icons/io5";

interface TabBarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export default function TabBar({ activeTab, onChangeTab }: TabBarProps) {
  // iOS tab bars use an outline glyph when idle and a solid glyph when active.
  const tabs = [
    { id: "home", label: "Home", active: IoHome, idle: IoHomeOutline },
    { id: "categories", label: "Categories", active: IoGrid, idle: IoGridOutline },
    { id: "shorts", label: "Shorts", active: IoPlayCircle, idle: IoPlayCircleOutline },
    { id: "my-courses", label: "My Courses", active: IoLibrary, idle: IoLibraryOutline },
    { id: "profile", label: "Profile", active: IoPerson, idle: IoPersonOutline },
  ];

  return (
    <div className="ios-tab-bar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = isActive ? tab.active : tab.idle;
        return (
          <button
            key={tab.id}
            className={`ios-clickable ios-tab-item flex-1 ${isActive ? "active text-[#007aff]" : "text-[#8e8e93]"}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <Icon size={25} className="mb-[2px]" />
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
