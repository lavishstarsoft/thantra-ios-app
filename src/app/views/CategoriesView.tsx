import React, { useState, useEffect } from "react";
import { getHomeData } from "../actions";
import { IoReloadOutline, IoSearch, IoChevronForward } from "react-icons/io5";

export default function CategoriesView() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await getHomeData();
      if (res.success && res.data) {
        setCategories(res.data.categories);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-t-3xl mt-2">
        <IoReloadOutline className="animate-spin text-[#007aff]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto pb-[100px] ios-scrollbar mt-2 rounded-t-3xl shadow-sm">
      <div className="safe-area-pb p-4">
        
        {/* iOS Style IoSearch Bar */}
        <div className="bg-[#f2f2f7] rounded-xl flex items-center px-3 py-2.5 mb-6">
          <IoSearch size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="bg-transparent border-none outline-none text-[16px] w-full text-gray-900 placeholder-gray-500"
          />
        </div>

        <h3 className="font-bold text-[19px] text-gray-900 tracking-tight mb-4">Explore All</h3>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            // Pick a random gradient for empty thumbnails
            const gradients = [
              "from-purple-500 to-indigo-500",
              "from-orange-400 to-red-500",
              "from-green-400 to-emerald-600",
              "from-blue-400 to-cyan-500"
            ];
            const bgClass = cat.thumbnailUrl ? "" : gradients[i % gradients.length];

            return (
              <div 
                key={cat.id} 
                className="ios-clickable relative h-32 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-end p-3 group"
              >
                {cat.thumbnailUrl ? (
                  <img src={cat.thumbnailUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} opacity-90`}></div>
                )}
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <h4 className="relative z-10 text-white font-bold text-[15px]">{cat.name}</h4>
                <p className="relative z-10 text-white/80 text-[11px] mt-0.5">Explore courses</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
