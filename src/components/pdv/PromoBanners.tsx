import React from 'react';
import { useStore } from '@/context/StoreContext';

export const PromoBanners = () => {
  const { promoBanners } = useStore();
  
  const activeBanners = promoBanners.filter(b => b.active);
  if (activeBanners.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-2 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {activeBanners.map((banner, index) => {
        // Fallback colors if no image, alternating
        const fallbackColors = ['bg-rose-600', 'bg-amber-500', 'bg-emerald-600', 'bg-blue-600'];
        const color = fallbackColors[index % fallbackColors.length];
        
        return (
          <div 
            key={banner.id} 
            className={`${color} min-w-[280px] h-[140px] shrink-0 rounded-2xl snap-center p-4 flex items-end text-white relative overflow-hidden shadow-md`}
          >
            {banner.imageUrl ? (
              <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <p className="relative font-bold text-lg leading-tight z-10 w-full pr-4">{banner.title}</p>
          </div>
        );
      })}
    </div>
  );
};
