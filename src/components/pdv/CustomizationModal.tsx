import React, { useState, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import type { Product } from '@/types';

interface CustomizationModalProps {
  product: Product;
  extrasCatalogue: Product[];
  onClose: () => void;
  onConfirm: (removals: string[], additions: { name: string; price: number }[]) => void;
}

export const CustomizationModal = ({ product, extrasCatalogue, onClose, onConfirm }: CustomizationModalProps) => {
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [selectedAdditions, setSelectedAdditions] = useState<{ name: string; price: number }[]>([]);

  // Lógica de separação de ingredientes (Remover x Adicionar)
  const { removals, additions } = useMemo(() => {
    const rems: string[] = [];
    const adds: { name: string; price: number }[] = [];

    (product.customizations || []).forEach(opt => {
      const extraProduct = extrasCatalogue.find(
        p => p.category === 'extras' && p.name.toLowerCase() === opt.toLowerCase()
      );

      if (extraProduct) {
        adds.push({ name: opt, price: extraProduct.price });
      } else if (opt.toLowerCase().startsWith('extra ') && !extraProduct) {
        adds.push({ name: opt, price: 8.00 });
      } else {
        rems.push(opt);
      }
    });

    return { removals: rems, additions: adds };
  }, [product.customizations, extrasCatalogue]);

  const toggleRemoval = (opt: string) => {
    setSelectedRemovals(prev =>
      prev.includes(opt) ? prev.filter(r => r !== opt) : [...prev, opt]
    );
  };

  const toggleAddition = (add: { name: string; price: number }) => {
    setSelectedAdditions(prev =>
      prev.some(a => a.name === add.name)
        ? prev.filter(a => a.name !== add.name)
        : [...prev, add]
    );
  };

  // Calcula o valor total (Produto + Adicionais selecionados)
  const totalPrice = product.price + selectedAdditions.reduce((acc, curr) => acc + curr.price, 0);

  return (
    // Overlay fixo com desfoque e animação de fade
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      
      {/* Container do Modal: No mobile cola em baixo (rounded-t), no Desktop centraliza (rounded-3xl) */}
      <div className="bg-card sm:border border-border/50 rounded-t-[2rem] sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header Fixo */}
        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Personalizar</h3>
            <p className="text-sm text-muted-foreground font-medium truncate max-w-[250px]">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 p-2.5 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Corpo Rolável (Scroll) */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-8 bg-secondary/10">
          
          {/* SESSÃO: Remoções (Sem custo) */}
          {removals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h4 className="font-bold text-foreground text-lg tracking-tight">Remover Ingredientes</h4>
                <span className="text-xs font-bold bg-secondary border border-border/50 text-muted-foreground px-2.5 py-1 rounded-md">Grátis</span>
              </div>
              <div className="space-y-2.5">
                {removals.map(opt => {
                  const isSelected = selectedRemovals.includes(opt);
                  return (
                    // Card Inteiro Clicável
                    <label key={opt} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                      isSelected ? 'border-destructive bg-destructive/5' : 'border-border/50 bg-card hover:border-destructive/30'
                    }`}>
                      <span className={`text-base font-medium transition-colors ${isSelected ? 'text-destructive line-through' : 'text-foreground'}`}>
                        {isSelected ? `Sem ${opt}` : opt}
                      </span>
                      
                      {/* Checkbox Customizado (Quadrado para remoções) */}
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-destructive border-destructive text-destructive-foreground' : 'border-muted-foreground/30 text-transparent'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleRemoval(opt)} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SESSÃO: Adicionais (Pagos) */}
          {additions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h4 className="font-bold text-foreground text-lg tracking-tight">Turbine seu pedido</h4>
                <span className="text-xs font-bold bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-md">Pagos</span>
              </div>
              <div className="space-y-2.5">
                {additions.map(add => {
                  const isSelected = selectedAdditions.some(a => a.name === add.name);
                  return (
                    // Card Inteiro Clicável
                    <label key={add.name} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                      isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 bg-card hover:border-primary/30'
                    }`}>
                      <div className="flex flex-col">
                        <span className={`text-base font-medium transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>{add.name}</span>
                        <span className="text-sm font-bold text-muted-foreground">+ R$ {add.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                      
                      {/* Checkbox Customizado (Redondo para adicionais) */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 text-transparent'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleAddition(add)} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Fixo: Resumo e Botão de Ação */}
        <div className="p-5 border-t border-border/50 bg-background z-10 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => onConfirm(selectedRemovals, selectedAdditions)}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-between px-6"
          >
            <span>Adicionar ao Pedido</span>
            <span className="font-display tracking-wide">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
