import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[101] shadow-2xl flex flex-col max-h-[85vh] transition-transform transform translate-y-0 pb-[env(safe-area-inset-bottom)]">
        
        {/* Handle and Header */}
        <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between px-4">
            <div className="w-8" /> {/* Spacer for centering */}
            <h3 className="font-semibold text-[17px] text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full ios-clickable text-gray-600"
            >
              <IoClose size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto px-4 py-4 hide-scrollbar ios-scrollbar flex-1">
          {children}
        </div>
      </div>
    </>
  );
}
