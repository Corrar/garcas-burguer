import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, Frown, Plus, XCircle } from 'lucide-react';
import { CATEGORY_LABELS } from '@/types';
import type { Category, Product } from '@/types';
import { CustomizationModal } from '@/components/pdv/CustomizationModal';
import { toast } from 'sonner';

export default function SearchPage() {
  const { products, addToCart } = useStore();
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtra as categorias para NÃO mostrar a aba "Adicionais (extras)"
  const displayCategories = Object.entries(CATEGORY_LABELS).filter(([key]) => key !== 'extras');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Escondemos sempre os "extras" da busca principal
      if (p.category === 'extras') return false;

      const searchLower = query.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                            p.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, query, activeCategory]);

  const extrasCatalogue = useMemo(() => products.filter(p => p.category === 'extras'), [products]);

  const handleAddToCart = (removals: string[], additions: { name: string; price: number }[]) => {
    if (selectedProduct) {
      addToCart(selectedProduct, removals, additions);
      toast.success(`${selectedProduct.name} adicionado ao pedido!`);
      setSelectedProduct(null);
    }
  };

  return (
    // CORREÇÃO: bg-background garante que a cor base (escura) do sistema é aplicada
    <div className="min-h-screen bg-background flex flex-col pt-20 pb-[100px] animate-in fade-in">
      
      {/* Área de Busca e Filtros (Fixa no topo, mas abaixo do TopNav) */}
      <div className="sticky top-[60px] lg:top-[72px] z-30 bg-background/90 backdrop-blur-xl pb-3 px-4 lg:px-8 border-b border-border/40 shadow-sm">
        
        {/* Barra de Pesquisa "Nível iFood" */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Item ou ingrediente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-card border border-border/50 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm font-medium"
          />
          {/* Botão de Limpar Pesquisa (Só aparece se houver texto) */}
          {query.length > 0 && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <XCircle className="w-5 h-5 fill-muted" />
            </button>
          )}
        </div>

        {/* Filtros Magnéticos (Pills) */}
        <div className="flex gap-2.5 overflow-x-auto mt-4 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${
              activeCategory === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card text-muted-foreground border border-border/60 hover:text-foreground hover:border-border'
            }`}
          >
            Todos
          </button>
          {displayCategories.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as Category)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${
                activeCategory === key 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card text-muted-foreground border border-border/60 hover:text-foreground hover:border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados da Busca */}
      <div className="flex-1 p-4 lg:p-8">
        
        {/* Estado Vazio Premium */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-5 border border-border/30">
              <Search className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">Nenhum item encontrado</p>
            <p className="text-sm text-center max-w-[250px] mt-2">
              Tente buscar por outro termo ou limpe os filtros selecionados.
            </p>
            {query.length > 0 && (
              <button 
                onClick={() => setQuery('')}
                className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors"
              >
                Limpar Busca
              </button>
            )}
          </div>
        ) : (
          /* Grid de Cartões (Layout Horizontal Mobile-First) */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
                // CORREÇÃO: Força o uso do bg-card para o fundo do cartão se destacar contra o bg-background escuro
                className="bg-card rounded-[1.25rem] p-3.5 flex gap-4 cursor-pointer border border-border/40 hover:border-primary/30 shadow-sm transition-all duration-300 active:scale-[0.98] animate-in slide-in-from-bottom-4 fade-in group"
              >
                {/* Detalhes do Produto (Esquerda) */}
                <div className="flex-1 flex flex-col min-w-0 justify-between py-0.5">
                  <div>
                    <h3 className="font-bold text-foreground truncate text-base">{product.name}</h3>
                    <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-bold text-foreground text-[15px]">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Imagem do Produto e Botão Add (Direita) */}
                <div className="flex flex-col items-end justify-between">
                  <div className="w-24 h-24 shrink-0 rounded-xl bg-secondary/50 relative overflow-hidden border border-border/30">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <Frown className="w-6 h-6 opacity-20" />
                      </div>
                    )}
                  </div>
                  
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Customização */}
      {selectedProduct && (
        <CustomizationModal
          product={selectedProduct}
          extrasCatalogue={extrasCatalogue}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleAddToCart}
        />
      )}
    </div>
  );
}