import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessário para o botão de navegação
import { useStore } from '@/context/StoreContext';
import { Star, ChevronRight, ReceiptText } from 'lucide-react';

export const StoreHeader = () => {
  const { settings, orders } = useStore();
  const navigate = useNavigate();

  // Calcula a Média Geral da Loja com prevenção de erros
  const ratingsInfo = useMemo(() => {
    let totalScore = 0;
    let reviewCount = 0;

    const safeOrders = orders || [];

    safeOrders.forEach(order => {
      if (order?.rating?.aspects) {
        const aspectValues = Object.values(order.rating.aspects) as number[];
        if (aspectValues.length > 0) {
          const avgAspect = aspectValues.reduce((a, b) => a + b, 0) / aspectValues.length;
          totalScore += avgAspect;
          reviewCount++;
        }
      }
    });

    const average = reviewCount > 0 ? (totalScore / reviewCount).toFixed(1) : 'Novo';
    return { average, count: reviewCount };
  }, [orders]);

  const isStoreOpen = settings?.isOpen ?? false;
  const deliveryFee = settings?.deliveryFee ?? 0;
  const estimatedTime = settings?.estimatedDeliveryTime ?? 'Calculando...';

  return (
    <div className="flex flex-col mt-20 lg:mt-6 mb-6 bg-card border border-border/50 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group">
      
      {/* Detalhe visual de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex items-start justify-between gap-3 relative z-10">
        
        {/* Info da Loja */}
        <div className="flex flex-col flex-1">
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
            Garça's Burguer
          </h1>
          
          {/* MÓDULO DE AVALIAÇÃO - Seguro e Responsivo */}
          <div className="flex items-center flex-wrap gap-2 mt-2 cursor-pointer w-fit">
            <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {ratingsInfo.average}
            </span>
            
            {ratingsInfo.count > 0 ? (
              <span className="text-xs font-medium text-muted-foreground flex items-center mt-1 sm:mt-0">
                • {ratingsInfo.count} {ratingsInfo.count === 1 ? 'avaliação' : 'avaliações'}
                <ChevronRight className="w-3 h-3 ml-0.5 opacity-50" />
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground mt-1 sm:mt-0">
                • Seja o primeiro a avaliar!
              </span>
            )}
          </div>
        </div>

        {/* Status e Ações */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          
          <div className="flex items-center gap-2">
            {/* Botão de Meus Pedidos para facilitar o teste */}
            <button 
              onClick={() => navigate('/meus-pedidos')}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded-full transition-colors active:scale-95"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              Pedidos
            </button>

            {isStoreOpen ? (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Aberto
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-widest text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded-full uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                Fechado
              </span>
            )}
          </div>
          
          {/* Taxa de Entrega */}
          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground text-right mt-1">
            {estimatedTime}<br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span>
            R$ {deliveryFee.toFixed(2).replace('.', ',')}
          </span>
        </div>

      </div>
    </div>
  );
};