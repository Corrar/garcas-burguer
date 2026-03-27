import type { Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

export const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 pt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors shadow-sm border border-transparent ${
            activeCategory === cat
              ? 'bg-secondary text-primary border-primary/20'
              : 'bg-secondary text-foreground hover:bg-secondary/80 opacity-80'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
};
