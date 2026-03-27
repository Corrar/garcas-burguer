import React from 'react';

interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export const FloatingCartButton = ({ itemCount, total, onClick }: FloatingCartButtonProps) => {
  if (itemCount === 0) return null;
  
  return (
    <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-8">
      <button 
        onClick={onClick}
        className="w-full bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl shadow-primary/30 flex items-center justify-between hover:bg-primary/90 transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shadow-inner">
            {itemCount}
          </div>
          <span className="font-semibold text-lg">Ver Sacola</span>
        </div>
        <div className="font-bold text-xl tracking-tight">
          R$ {total.toFixed(2)}
        </div>
      </button>
    </div>
  );
};
