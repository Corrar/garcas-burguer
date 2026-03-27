import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
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

  const { removals, additions } = useMemo(() => {
    const rems: string[] = [];
    const adds: { name: string; price: number }[] = [];

    (product.customizations || []).forEach(opt => {
      // Find if this option is an extra in the catalogue (case insensitive)
      const extraProduct = extrasCatalogue.find(
        p => p.category === 'extras' && p.name.toLowerCase() === opt.toLowerCase()
      );

      if (extraProduct) {
        adds.push({ name: opt, price: extraProduct.price });
      } else if (opt.toLowerCase().startsWith('extra ') && !extraProduct) {
        // Fallback for extras not in catalogue, like "Extra carne"
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="font-display text-2xl">Personalizar</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 pr-2 space-y-6">
          {removals.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <span>Remover Ingredientes / Ponto (Sem Custo)</span>
              </p>
              <div className="space-y-2">
                {removals.map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRemovals.includes(opt)}
                      onChange={() => toggleRemoval(opt)}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {additions.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3">Adicionais Pagos</p>
              <div className="space-y-2">
                {additions.map(add => (
                  <label key={add.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAdditions.some(a => a.name === add.name)}
                        onChange={() => toggleAddition(add)}
                        className="w-4 h-4 rounded text-primary accent-primary"
                      />
                      <span className="text-sm font-medium">{add.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">+ R$ {add.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onConfirm(selectedRemovals, selectedAdditions)}
          className="w-full mt-6 py-3 shrink-0 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          Adicionar ao Pedido
        </button>
      </div>
    </div>
  );
};
