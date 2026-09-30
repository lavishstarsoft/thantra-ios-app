import React from "react";
import { IoPersonOutline, IoShieldCheckmarkOutline, IoChevronForward, IoHelpCircleOutline, IoMoonOutline, IoDocumentTextOutline, IoShareSocialOutline, IoTrashOutline, IoLogOutOutline } from "react-icons/io5";
import { useSession, clearSession } from "../lib/session";

export default function ProfileView({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const { user, isLoggedIn, ready } = useSession();

  if (ready && !isLoggedIn) {
    return (
      <div className="flex-1 overflow-y-auto pb-[100px] bg-white rounded-t-3xl mt-2 shadow-sm flex flex-col justify-center px-6">
        <div className="text-center mb-8 mt-10">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoPersonOutline size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Thantra</h2>
          <p className="text-gray-500 text-[15px]">Sign in to access your purchased courses, bookmarks, and personalized content.</p>
        </div>

        <button
          className="w-full bg-[#007aff] text-white font-semibold py-3.5 rounded-xl active:opacity-70 transition-opacity mb-4"
          onClick={onOpenLogin}
        >
          Sign In with Mobile
        </button>
      </div>
    );
  }

  const displayName = user?.name || "Guest User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto pb-[100px] bg-[#f2f2f7] rounded-t-3xl mt-2 shadow-sm">

      {/* Profile Header Card */}
      <div className="mt-6 mx-4 rounded-[24px] bg-white shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md mb-3">
            {initial}
          </div>
          <h2 className="text-[22px] font-bold text-gray-900 leading-tight">{displayName}</h2>
          <p className="text-gray-500 text-[14px] mt-1">{user?.phone || ""}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white mx-4 rounded-xl overflow-hidden mb-6 border border-gray-100">
        <MenuRow icon={<IoPersonOutline size={18} />} label="Edit Profile" />
        <MenuRow icon={<IoShieldCheckmarkOutline size={18} />} label="Security" />
        <MenuRow icon={<IoMoonOutline size={18} />} label="Dark Mode" />
      </div>

      <div className="bg-white mx-4 rounded-xl overflow-hidden mb-6 border border-gray-100">
        <MenuRow icon={<IoDocumentTextOutline size={18} />} label="Terms & Conditions" />
        <MenuRow icon={<IoHelpCircleOutline size={18} />} label="Help Center" />
        <MenuRow icon={<IoShareSocialOutline size={18} />} label="Invite Friends" />
      </div>

      <div className="bg-white mx-4 rounded-xl overflow-hidden mb-8 border border-gray-100">
        <MenuRow icon={<IoTrashOutline size={18} />} label="Delete Account" danger />
        <MenuRow icon={<IoLogOutOutline size={18} />} label="Logout" danger onClick={() => clearSession()} />
      </div>

    </div>
  );
}

function MenuRow({ icon, label, danger = false, onClick }: { icon: React.ReactNode, label: string, danger?: boolean, onClick?: () => void }) {
  return (
    <div 
      className={`flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors cursor-pointer ${danger ? 'text-red-500' : 'text-gray-800'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`mr-3 ${danger ? 'text-red-500' : 'text-gray-500'}`}>
          {icon}
        </div>
        <span className="text-[16px] font-medium">{label}</span>
      </div>
      {!danger && <IoChevronForward size={20} className="text-gray-300" />}
    </div>
  );
}
