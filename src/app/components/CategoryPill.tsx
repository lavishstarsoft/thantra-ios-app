import React from "react";

interface CategoryPillProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export default function CategoryPill({ label, icon, isActive = false, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`ios-clickable flex items-center px-4 py-2 rounded-full mr-2 whitespace-nowrap text-[14px] font-medium transition-colors ${
        isActive 
          ? "bg-[#007aff] text-white" 
          : "bg-[#f2f2f7] text-gray-800 border border-gray-200/50"
      }`}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </button>
  );
}
