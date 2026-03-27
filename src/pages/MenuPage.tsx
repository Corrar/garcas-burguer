import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Flame } from 'lucide-react';
import burgerHero from '@/assets/burger-hero.jpg';

const MenuPage = () => {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const categories: (Category | 'all')[] = ['all', 'burgers', 'combos', 'sides', 'drinks', 'extras'];
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <img src={burgerHero} alt="Burger Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-6 left-6 lg:left-10">
          <h1 className="font-display text-5xl lg:text-6xl text-primary">Cardápio</h1>
          <p className="text-muted-foreground">Artesanal • Feito na brasa • Com amor</p>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Todos
          </button>
          {(['burgers', 'combos', 'sides', 'drinks', 'extras'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="glass-card overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {product.popular && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    <Flame className="w-3 h-3" /> Popular
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-2xl">{product.name}</h3>
                  <span className="font-display text-2xl text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
