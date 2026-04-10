import { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Flame, Plus, Search } from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MenuPage = () => {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  // Conecte aqui sua CustomizationModal futuramente
  const handleProductClick = (product: Product) => {
    console.log('Produto selecionado:', product.name);
  };

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  // ── Refs para as animações ──────────────────────────────────
  const pageRef        = useRef<HTMLDivElement>(null);
  const heroRef        = useRef<HTMLDivElement>(null);
  const heroTextRef    = useRef<HTMLDivElement>(null);
  const categoriesRef  = useRef<HTMLDivElement>(null);
  const gridRef        = useRef<HTMLDivElement>(null);

  // ── GSAP: animações de entrada + parallax + cards ───────────
  useGSAP(() => {
    const heroText   = heroTextRef.current;
    const categories = categoriesRef.current;
    const hero       = heroRef.current;
    const grid       = gridRef.current;

    // Guard: se algum ref não estiver montado ainda, sai sem fazer nada
    if (!heroText || !categories || !hero || !grid) return;

    const tabs = categories.querySelectorAll<HTMLElement>('.category-tab');

    // A. Estado inicial dos elementos
    gsap.set(heroText, { opacity: 0, y: 80 });
    gsap.set(tabs, { opacity: 0, x: -24 });

    // B. Timeline de entrada
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(heroText, { opacity: 1, y: 0, duration: 0.9, delay: 0.2 })
      .to(tabs, { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.5');

    // C. Parallax: texto do hero some ao rolar
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      animation: gsap.to(heroText, { opacity: 0, y: -60, ease: 'none' }),
    });

    // D. Cards do grid entram com stagger
    const cards = grid.querySelectorAll<HTMLElement>('.product-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, { scope: pageRef, dependencies: [activeCategory] });

  return (
    <div ref={pageRef} className="min-h-full pb-40 lg:pb-12 bg-background flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative h-[35vh] lg:h-[45vh] min-h-[220px] w-full shrink-0 overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-xl z-10"
      >
        {/* Vídeo de fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-flames-on-a-bbq-grill-34440-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Título */}
        <div ref={heroTextRef} className="absolute bottom-6 left-6 lg:left-12 lg:bottom-12 z-20">
          <h1 className="font-display text-4xl lg:text-7xl text-foreground font-extrabold tracking-tight drop-shadow-lg leading-tight mb-2">
            Garça's Burguer
          </h1>
          <p className="text-muted-foreground text-sm lg:text-lg font-bold tracking-wider uppercase">
            Artesanal • Feito na brasa • Com amor
          </p>
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-8 flex-1 flex flex-col">

        {/* ── CATEGORY TABS ─────────────────────────────────── */}
        <div
          ref={categoriesRef}
          className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-border/50"
        >
          {/* Todos */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`category-tab px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 flex items-center shrink-0 border shadow-sm ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105'
                : 'bg-card text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {activeCategory === 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground mr-2 animate-pulse" />
            )}
            Todos os itens
          </button>

          {/* Categorias */}
          {(['burgers', 'combos', 'sides', 'drinks', 'extras'] as Category[]).map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 flex items-center shrink-0 border shadow-sm ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105'
                    : 'bg-card text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground mr-2 animate-pulse" />
                )}
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* ── PRODUCT GRID ──────────────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-12"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-muted-foreground animate-in fade-in">
              <Search className="w-14 h-14 mb-4 opacity-20" />
              <p className="font-bold text-xl text-foreground">Nenhum produto encontrado</p>
              <p className="text-sm">Tente selecionar outra categoria.</p>
            </div>
          ) : (
            filtered.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="product-card group bg-card border border-border/50 rounded-3xl p-5 flex justify-between gap-5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-visible text-left w-full h-[150px] md:h-[160px] active:scale-[0.98]"
              >
                {/* Textos */}
                <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-foreground leading-tight truncate mb-1.5 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed pr-2 font-medium">
                      {product.description}
                    </p>
                  </div>
                  <span className="font-bold text-base md:text-lg text-foreground">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Imagem */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 -mt-8 mb-[-8px] z-10 rounded-[1.75rem] overflow-hidden bg-secondary border border-border/50 shadow-lg group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  {product.popular && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/30">
                      <Flame className="w-3 h-3" /> POPULAR
                    </div>
                  )}
                </div>

                {/* Botão + flutuante */}
                <div className="absolute -bottom-4 -right-4 w-11 h-11 rounded-full bg-card border border-border/80 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground shadow-lg transition-all duration-300">
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default MenuPage;