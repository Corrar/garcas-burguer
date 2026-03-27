import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export const FloatingCartButton = ({ itemCount, total, onClick }: FloatingCartButtonProps) => {
  // Se a sacola estiver vazia, o botão desaparece
  if (itemCount === 0) return null;
  
  return (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button 
        onClick={onClick}
        // Classes premium: botão em pílula (rounded-full), sombra com a cor primária translúcida, e efeito de clique (active:scale)
        className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-between hover:bg-primary/90 transition-all active:scale-[0.97] border border-white/10"
      >
        <div className="flex items-center gap-3">
          {/* Container Relativo para o Ícone + Badge de Notificação */}
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            {/* O número de itens flutua no canto superior direito do ícone */}
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background text-foreground flex items-center justify-center font-bold text-[11px] shadow-sm">
              {itemCount}
            </div>
          </div>
          <span className="font-semibold text-lg tracking-tight">Ver Sacola</span>
        </div>
        
        {/* Preço total formatado no padrão brasileiro */}
        <div className="font-bold text-xl tracking-tight">
          R$ {total.toFixed(2).replace('.', ',')}
        </div>
      </button>
    </div>
  );
};
