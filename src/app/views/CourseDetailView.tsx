import React, { useState, useEffect } from "react";
import { IoPlayCircle, IoDocumentTextOutline, IoStar, IoTimeOutline, IoReloadOutline } from "react-icons/io5";
import BottomSheet from "../components/BottomSheet";
import { getCourseDetails } from "../actions";

interface CourseDetailViewProps {
  courseId: string | null;
  onBack: () => void;
}

export default function CourseDetailView({ courseId, onBack }: CourseDetailViewProps) {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
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
    <div className="flex-1 bg-white overflow-y-auto pb-[90px] ios-scrollbar mt-2 rounded-t-3xl shadow-sm z-40 relative">
      
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

      {/* Fixed Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom,20px)] flex justify-between items-center z-50">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Price</p>
          <p className="text-gray-900 font-bold text-2xl">{course.priceLabel || "Free"}</p>
        </div>
        <button 
          onClick={() => setIsPurchaseOpen(true)}
          className="bg-[#007aff] text-white px-8 py-3.5 rounded-full font-bold text-[16px] ios-clickable shadow-md shadow-blue-500/20"
        >
          {course.isFree ? "Enroll for Free" : "Buy Now"}
        </button>
      </div>

      {/* Purchase Bottom Sheet */}
      <BottomSheet 
        isOpen={isPurchaseOpen} 
        onClose={() => setIsPurchaseOpen(false)}
        title={course.isFree ? "Confirm Enrollment" : "Confirm Purchase"}
      >
        <div className="pb-4">
          <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-xl">
            {course.thumbnailUrl ? (
               <img src={course.thumbnailUrl} className="w-14 h-14 rounded-lg mr-4 object-cover" alt="" />
            ) : (
               <div className="w-14 h-14 bg-purple-200 rounded-lg mr-4"></div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-[15px] line-clamp-1">{course.title}</h4>
              <p className="text-gray-500 text-[13px]">{course.accessValidityDays > 0 ? `${course.accessValidityDays} Days Access` : 'Lifetime Access'}</p>
            </div>
          </div>

          {!course.isFree && (
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{(course.checkoutAmountCents / 100).toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="flex justify-between text-[17px] font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{(course.checkoutAmountCents / 100).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button 
            className="w-full bg-black text-white font-semibold py-4 rounded-xl ios-clickable text-[17px] flex justify-center items-center"
            onClick={() => {
              // Real payment integration will trigger here
              setIsPurchaseOpen(false);
              alert(course.isFree ? "Successfully enrolled!" : "Redirecting to Payment Gateway...");
            }}
          >
            {course.isFree ? "Enroll Now" : `Pay ₹${(course.checkoutAmountCents / 100).toFixed(2)}`}
          </button>
        </div>
      </BottomSheet>

    </div>
  );
}
