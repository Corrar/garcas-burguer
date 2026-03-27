import React from 'react';
import type { Product } from '@/types';
import { Flame, Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (productId: string) => void;
}

export const ProductGrid = ({ products, onAddProduct }: ProductGridProps) => {
  return (
    // Container do Grid: responsivo desde celular (1 coluna) até telas gigantes (4 colunas)
    <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 content-start pb-24 lg:pb-8 pt-2">
      {products.map((product, index) => (
        <button
          key={product.id}
          onClick={() => onAddProduct(product.id)}
          // Efeito cascata: delay calculado pelo index * 50ms
          style={{ animationDelay: `${index * 50}ms`, animationDuration: '500ms' }}
          className="group bg-card border border-border/50 shadow-sm hover:shadow-md rounded-2xl p-4 text-left hover:border-primary/40 transition-all duration-300 flex justify-between gap-4 relative overflow-hidden animate-in slide-in-from-bottom-4 fade-in fill-mode-both w-full h-[140px] md:h-[150px]"
        >
          {/* Lado Esquerdo: Textos e Preço */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
            <div>
              <h3 className="font-bold text-base md:text-lg text-foreground leading-tight truncate mb-1.5">
                {product.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed pr-2">
                {product.description}
              </p>
            </div>
            
            <div className="mt-2 flex items-center">
              <span className="font-bold text-base md:text-lg text-foreground">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Lado Direito: Imagem, Selo Popular e Botão "+" */}
          <div className="shrink-0 relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary border border-border/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Badge Popular estilo blur/glassmorphism */}
            {product.popular && (
              <div className="absolute top-0 left-0 w-full bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-bold py-1 text-center flex items-center justify-center gap-1 shadow-sm">
                <Flame className="w-3 h-3" /> POPULAR
              </div>
            )}
            
            {/* Botão de Adicionar (+) flutuando no canto inferior direito da imagem */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-tl-2xl rounded-br-xl bg-card border-t border-l border-border/50 shadow-sm flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Plus className="w-5 h-5 mb-1.5 mr-1.5" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
