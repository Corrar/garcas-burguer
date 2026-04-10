import React from 'react';
import type { Product } from '@/types';
import { Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddProduct }) => {
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4 border border-border/30">
          <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-40" />
        </div>
        <p className="font-display font-bold text-xl text-foreground">Nenhum produto nesta categoria</p>
        <p className="text-sm mt-1">Tente selecionar outra aba no menu acima.</p>
      </div>
    );
  }

  return (
    // CORREÇÃO: pb-28 garante muito espaço no final da lista no mobile para não ficar atrás do botão da sacola e do menu inferior
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 pb-28 lg:pb-6">
      {products.map((product, index) => (
        <div 
          key={product.id}
          onClick={() => onAddProduct(product.id)}
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          className="bg-card rounded-[1.25rem] p-4 flex gap-4 cursor-pointer border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 active:scale-[0.98] animate-in slide-in-from-bottom-6 fade-in group relative"
        >
          {/* Badge de Popular (Aparece flutuando sobre o card) */}
          {product.popular && (
            <div className="absolute -top-2.5 -left-2.5 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1 border-2 border-background">
              <span>⭐</span> Mais Pedido
            </div>
          )}

          {/* Detalhes do Produto (Textos à Esquerda) */}
          <div className="flex-1 flex flex-col min-w-0 justify-between py-0.5">
            <div>
              <h3 className="font-bold text-foreground truncate text-base lg:text-lg group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                {product.description}
              </p>
            </div>
            
            {/* Preço e Botão Nível iFood */}
            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
              <span className="font-bold text-foreground text-[16px]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Evita acionar o onClick do card "pai" duas vezes
                  onAddProduct(product.id);
                  // O toast (aviso) é disparado pela função onAddProduct que vem do PDVPage,
                  // ou pela função confirmCustomization se o item tiver extras.
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground rounded-full text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* Imagem do Produto (À Direita) */}
          <div className="flex flex-col items-end shrink-0">
            <div className="w-28 h-28 lg:w-32 lg:h-32 shrink-0 rounded-[1rem] bg-secondary/30 relative overflow-hidden border border-border/30">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};