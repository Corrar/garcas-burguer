import React, { useState, useMemo } from 'react';
import { X, Check, MessageSquare } from 'lucide-react';
import type { Product } from '@/types';

interface CustomizationModalProps {
  product: Product;
  extrasCatalogue: Product[];
  onClose: () => void;
  // IMPORTANTE: Adicionado o parâmetro 'notes' na função onConfirm
  onConfirm: (removals: string[], additions: { name: string; price: number }[], notes: string) => void;
}

export const CustomizationModal = ({ product, extrasCatalogue, onClose, onConfirm }: CustomizationModalProps) => {
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [selectedAdditions, setSelectedAdditions] = useState<{ name: string; price: number }[]>([]);
  
  // Novo estado para controlar o que o cliente digita nas observações do item
  const [itemNotes, setItemNotes] = useState('');

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
    // CORREÇÃO: z-[100] para ficar acima de tudo
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      
      {/* CORREÇÃO: max-h-[90dvh] para respeitar as barras do celular */}
      <div className="bg-background sm:border border-border/50 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90dvh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header Fixo */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-border/50 bg-card z-10 shrink-0">
          <div className="pr-4">
            <h3 className="font-display text-2xl font-bold text-foreground leading-tight mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 p-2.5 rounded-full transition-colors active:scale-95 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Corpo Rolável (Scroll) com fundo levemente acinzentado */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 bg-muted/30 custom-scrollbar">
          
          {/* SESSÃO: Remoções (Sem custo) */}
          {removals.length > 0 && (
            <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div>
                  <h4 className="font-bold text-foreground text-lg">Retirar Ingredientes</h4>
                  <p className="text-xs text-muted-foreground">O que você não quer?</p>
                </div>
                <span className="text-xs font-bold bg-secondary text-muted-foreground px-2 py-1 rounded">Sem Custo</span>
              </div>
              
              <div className="space-y-2 mt-3">
                {removals.map(opt => {
                  const isSelected = selectedRemovals.includes(opt);
                  return (
                    <label key={opt} className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                      isSelected ? 'border-destructive bg-destructive/5' : 'border-transparent bg-secondary hover:bg-secondary/80'
                    }`}>
                      <span className={`text-[15px] font-medium transition-colors ${isSelected ? 'text-destructive line-through opacity-80' : 'text-foreground'}`}>
                        {opt}
                      </span>
                      
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-destructive border-destructive text-destructive-foreground' : 'border-muted-foreground/30 bg-background'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
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
            <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div>
                  <h4 className="font-bold text-foreground text-lg">Adicionais</h4>
                  <p className="text-xs text-muted-foreground">Turbine seu pedido!</p>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">Pagos</span>
              </div>
              
              <div className="space-y-2 mt-3">
                {additions.map(add => {
                  const isSelected = selectedAdditions.some(a => a.name === add.name);
                  return (
                    <label key={add.name} className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary hover:bg-secondary/80'
                    }`}>
                      <div className="flex flex-col">
                        <span className={`text-[15px] font-medium transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>{add.name}</span>
                        <span className="text-sm font-bold text-muted-foreground">+ R$ {add.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background'
                      }`}>
                         {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleAddition(add)} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SESSÃO: Observações do Item (Ex: ponto da carne, sem sal) */}
          <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
             <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-bold text-foreground text-lg">Alguma observação?</h4>
             </div>
             <textarea 
               value={itemNotes}
               onChange={(e) => setItemNotes(e.target.value)}
               placeholder="Ex: Ponto da carne, sem sal na batata, molho à parte..."
               className="w-full mt-2 bg-secondary/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3.5 text-[15px] resize-none h-24 text-foreground placeholder:text-muted-foreground transition-all"
             />
          </div>

        </div>

        {/* Footer Fixo: Resumo e Botão de Ação */}
        {/* CORREÇÃO: pb-8 adicionado para afastar o botão das bordas nativas do celular */}
        <div className="p-4 pb-8 sm:p-5 border-t border-border/50 bg-card z-10 shrink-0">
          <button
            onClick={() => onConfirm(selectedRemovals, selectedAdditions, itemNotes)}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-[17px] hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-between px-6"
          >
            <span>Adicionar ao Pedido</span>
            <span className="tracking-wide">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};