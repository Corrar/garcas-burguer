import React from 'react';
import type { Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

export const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  return (
    // Container com rolagem horizontal livre de barras (Scrollbar hidden)
    // O truque "-mx-4 px-4 sm:mx-0 sm:px-0" permite rolagem até a borda da tela no mobile
    <div className="flex gap-3 mb-6 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map(cat => {
        const isActive = activeCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            // Classes de transição e escala para criar o efeito magnético e tátil
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 flex items-center justify-center ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                : 'bg-card text-muted-foreground border border-border/50 hover:border-primary/40 hover:text-foreground shadow-sm'
            }`}
          >
            {/* Opcional: Um pequeno pontinho indicativo ao lado do texto quando ativo (estilo premium) */}
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground mr-2 animate-pulse" />
            )}
            {CATEGORY_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
};
