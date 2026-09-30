import React, { useState, useEffect } from "react";
import { IoPlayCircle, IoDocumentTextOutline, IoStar, IoTimeOutline, IoReloadOutline } from "react-icons/io5";
import { getCourseDetails } from "../actions";

interface CourseDetailViewProps {
  courseId: string | null;
  onBack: () => void;
}

export default function CourseDetailView({ courseId, onBack }: CourseDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return;
      const res = await getCourseDetails(courseId);
      if (res.success && res.data) {
        setCourse(res.data);
      }
      setLoading(false);
    }
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex-1 bg-white overflow-y-auto mt-2 rounded-t-3xl shadow-sm z-40 relative flex items-center justify-center">
        <IoReloadOutline className="animate-spin text-[#007aff]" size={32} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 bg-white overflow-y-auto mt-2 rounded-t-3xl shadow-sm z-40 relative flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Course not found or could not be loaded.</p>
        <button onClick={onBack} className="text-[#007aff] font-semibold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto pb-10 ios-scrollbar mt-2 rounded-t-3xl shadow-sm z-40 relative">
      
      {/* Video Player/Header */}
      <div className="w-full aspect-video bg-black relative rounded-t-3xl overflow-hidden flex items-center justify-center">
        {(course.hlsUrl || course.dashUrl) ? (
          <video 
            src={course.hlsUrl || course.dashUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            poster={course.thumbnailUrl || undefined}
          />
        ) : (
          <>
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/80 to-indigo-600/80" />
            )}
            <IoPlayCircle size={64} className="text-white/80 z-10 ios-clickable" strokeWidth={1} />
            <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
              Preview Not Available
            </div>
          </>
        )}
      </div>

      <div className="px-4 py-5">
        {course.category && (
          <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold inline-block mb-3">
            {course.category.name}
          </div>
        )}
        <h2 className="text-[22px] font-bold text-gray-900 leading-snug mb-3">
          {course.title}
        </h2>
        
        <div className="flex items-center text-gray-500 text-[14px] mb-5 space-x-4 border-b border-gray-100 pb-5">
          <div className="flex items-center">
            <IoStar size={16} fill="#FFB800" stroke="none" className="mr-1.5" />
            <span className="font-semibold text-gray-800">{course.rating || "4.5"}</span>
          </div>
          <div className="flex items-center">
            <IoTimeOutline size={16} className="mr-1.5" />
            <span>{course.duration || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <IoDocumentTextOutline size={16} className="mr-1.5" />
            <span>{course.lessons || 0} Lessons</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-bold text-[18px] text-gray-900 mb-2">About this Course</h3>
          <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">
            {course.description || "No description provided."}
          </p>
        </div>

      </div>

    </div>
  );
}
