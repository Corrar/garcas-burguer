import React from 'react';
import type { Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

// Dicionário de Emojis para dar aquele aspeto "iFood / UberEats"
const CATEGORY_ICONS: Record<Category, string> = {
  burgers: '🍔',
  combos: '🍱',
  sides: '🍟',
  drinks: '🥤',
  extras: '✨'
};

export const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  return (
    <div className="w-full">
      {/* Container com rolagem horizontal limpa, nativa e sem sombras bugadas */}
      <div className="flex gap-3.5 overflow-x-auto py-4 -mx-4 px-4 sm:mx-0 sm:px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              // O formato "Cápsula": padding assimétrico (pl-1.5 pr-5) para acomodar o círculo perfeitamente à esquerda
              className={`group relative flex items-center gap-3 pr-5 pl-1.5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ease-out active:scale-95 snap-start shrink-0 outline-none select-none ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 border-transparent' 
                  : 'bg-card text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-foreground shadow-sm hover:shadow-md'
              }`}
            >
              {/* Círculo Interno do Ícone (O detalhe Premium) */}
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-background shadow-sm scale-100' 
                    : 'bg-secondary group-hover:bg-primary/10 scale-95 group-hover:scale-100' 
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'grayscale-[40%]'}`}>
                  {CATEGORY_ICONS[cat]}
                </span>
              </div>

              {/* Texto da Categoria */}
              <span className={`tracking-tight transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-0.5'}`}>
                {CATEGORY_LABELS[cat]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};