import React from "react";
import { IoBookOutline, IoLockClosedOutline } from "react-icons/io5";
import { useSession } from "../lib/session";

export default function MyCoursesView({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const { isLoggedIn } = useSession();

  return (
    <div className="flex-1 bg-[#f2f2f7] overflow-y-auto pb-[100px] ios-scrollbar mt-2 rounded-t-3xl shadow-sm">
      
      {/* Top Segmented Control (iOS style tabs) */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100 rounded-t-3xl">
        <div className="bg-[#efeff4] p-1 rounded-[9px] flex">
          <button className="flex-1 bg-white shadow-sm py-1.5 rounded-md text-[13px] font-medium text-gray-900 text-center">
            Enrolled
          </button>
          <button className="flex-1 py-1.5 rounded-md text-[13px] font-medium text-gray-500 text-center ios-clickable">
            Bookmarks
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 safe-area-pb">
        
        {/* Empty State Mock */}
        <div className="bg-white rounded-[16px] p-8 flex flex-col items-center justify-center text-center mt-10 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <IoBookOutline size={32} className="text-[#007aff]" />
          </div>
          <h3 className="font-bold text-[18px] text-gray-900 mb-2">
            {isLoggedIn ? "No Courses Yet" : "Sign in to see your courses"}
          </h3>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
            {isLoggedIn
              ? "You haven't enrolled in any courses. Explore our catalog and start learning today."
              : "Sign in with your mobile number to view enrolled courses and continue watching."}
          </p>
          <button
            className="bg-[#007aff] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] ios-clickable"
            onClick={() => !isLoggedIn && onOpenLogin?.()}
          >
            {isLoggedIn ? "Browse Catalog" : "Sign In"}
          </button>
        </div>

        {/* Locked Feature Mock */}
        <div className="mt-6 bg-white rounded-[16px] p-5 shadow-sm flex items-start">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <IoLockClosedOutline size={20} className="text-orange-500" />
          </div>
          <div>
            <h4 className="font-semibold text-[15px] text-gray-900 mb-1">Downloads</h4>
            <p className="text-[13px] text-gray-500">
              Offline viewing is available for premium users. Upgrade to download videos.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
