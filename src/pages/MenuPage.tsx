import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Flame, Plus } from 'lucide-react';
import burgerHero from '@/assets/burger-hero.jpg';

const MenuPage = () => {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const categories: (Category | 'all')[] = ['all', 'burgers', 'combos', 'sides', 'drinks', 'extras'];
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full pb-24 bg-background">
      {/* 1. HERO SECTION: A Cena de Abertura */}
      <div className="relative h-48 lg:h-64 overflow-hidden rounded-b-[2rem] shadow-sm">
        <img src={burgerHero} alt="Burger Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-6 left-6 lg:left-10 animate-in slide-in-from-left-8 fade-in duration-700">
          <h1 className="font-display text-4xl lg:text-6xl text-foreground font-bold tracking-tight">Nosso Cardápio</h1>
          <p className="text-muted-foreground text-sm lg:text-base mt-1 font-medium">Artesanal • Feito na brasa • Com amor</p>
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-6">
        {/* 2. CATEGORY TABS (Sticky/Fixos no topo ao rolar) */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 mb-4 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeCategory === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Todos
          </button>
          {(['burgers', 'combos', 'sides', 'drinks', 'extras'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* 3. PRODUCTS GRID: Layout Horizontal Estilo iFood */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product, index) => (
            <div 
              key={product.id} 
              // Usamos o index para criar o atraso (delay) da animação, gerando o efeito cascata
              className="group bg-card border border-border/50 rounded-2xl p-3 flex gap-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
              style={{ animationDelay: `${index * 50}ms`, animationDuration: '500ms' }}
            >
              
              {/* Lado Esquerdo: Imagem do Produto */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {product.popular && (
                  <div className="absolute top-0 left-0 w-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold py-1 text-center flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3" /> POPULAR
                  </div>
                )}
              </div>

              {/* Lado Direito: Informações */}
              <div className="flex flex-col flex-1 py-1 justify-between">
                <div>
                  <h3 className="font-bold text-base md:text-lg text-foreground leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-base md:text-lg text-foreground">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Botão de Adicionar (+) Flutuante no Card */}
              <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
