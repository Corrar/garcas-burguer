import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { STATUS_LABELS, PAYMENT_LABELS } from '@/types';
import type { OrderStatus } from '@/types';
import { Receipt, Clock, ChefHat, Package, CheckCircle, CreditCard, ArrowRight, Star, MessageSquareQuote, ChevronDown, ChevronUp, Bike, Store, Utensils } from 'lucide-react';

const OrdersPage = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  
  // Estado para controlar quais avaliações estão expandidas (mostrando os detalhes)
  const [expandedRatings, setExpandedRatings] = useState<Record<string, boolean>>({});

  const toggleRatingDetails = (orderId: string) => {
    setExpandedRatings(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Função auxiliar para calcular a média
  const getAverageRating = (rating: any) => {
    if (!rating || !rating.aspects) return 0;
    const values = Object.values(rating.aspects) as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  // Ordena os pedidos para que os MAIS RECENTES apareçam primeiro
  const sortedOrders = useMemo(() => {
    const safeOrders = orders || [];
    return [...safeOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  const filtered = filter === 'all' ? sortedOrders : sortedOrders.filter(o => o.status === filter);

  // Mapa de cores e ÍCONES
  const statusConfig: Record<OrderStatus, { color: string; icon: React.ReactNode; pulse?: boolean }> = {
    pending: { color: 'bg-amber-500/15 text-amber-600 border-amber-500/30', icon: <Clock className="w-3 h-3" />, pulse: true },
    preparing: { color: 'bg-blue-500/15 text-blue-600 border-blue-500/30', icon: <ChefHat className="w-3 h-3" /> },
    ready: { color: 'bg-green-500/15 text-green-600 border-green-500/30', icon: <Package className="w-3 h-3" /> },
    delivered: { color: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700', icon: <CheckCircle className="w-3 h-3" /> },
  };

  return (
    <div className="p-4 lg:p-8 min-h-full pb-32 lg:pb-12 bg-background flex flex-col">

      {/* Cabeçalho */}
      <div className="mb-6 animate-in slide-in-from-left-4 fade-in duration-500 shrink-0">
        <h1 className="font-display text-3xl md:text-4xl text-foreground font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">Acompanhe o histórico, status e avaliações</p>
      </div>

      {/* 1. TABS (Filtros) */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
        {(['all', 'pending', 'preparing', 'ready', 'delivered'] as const).map(s => {
          const isActive = filter === s;
          const count = s === 'all' ? sortedOrders.length : sortedOrders.filter(o => o.status === s).length;
          
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                  : 'bg-card text-muted-foreground border border-border/50 hover:border-primary/40 hover:text-foreground shadow-sm'
              }`}
            >
              {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-muted'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Estado Vazio (Empty State) */}
      {filtered.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
          <Receipt className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-bold text-lg text-foreground">Nenhum pedido por aqui</p>
          <p className="text-sm">Os pedidos {filter !== 'all' ? 'com este status' : ''} aparecerão nesta lista.</p>
        </div>
      )}

      {/* Lista de Pedidos (Grid responsivo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-4">
        {filtered.map((order, index) => {
          const statusStyle = statusConfig[order.status];
          const hasRating = order.rating && order.rating.aspects;
          const isRatingExpanded = expandedRatings[order.id];
          
          return (
            <div
              key={order.id}
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationDuration: '500ms' }}
              className={`bg-card border rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in fill-mode-both flex flex-col ${
                order.status === 'pending' ? 'border-amber-500/50' : 'border-border/50'
              }`}
            >
              {/* Linha 1: Número, Status e Tipo de Pedido (Com Ícones) */}
              <div className="flex items-start justify-between mb-4 border-b border-border/50 pb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-2xl tracking-tight text-foreground uppercase">
                      #{order.number || order.id.slice(0, 5)}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.color} ${statusStyle.pulse ? 'animate-pulse' : ''}`}>
                      {statusStyle.icon}
                      {STATUS_LABELS[order.status]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-1">
                    {order.orderType === 'delivery' ? <Bike className="w-3.5 h-3.5 text-primary" /> : 
                     order.orderType === 'dine-in' ? <Utensils className="w-3.5 h-3.5 text-primary" /> :
                     <Store className="w-3.5 h-3.5 text-primary" />}
                    
                    {order.orderType === 'delivery' ? 'Entrega' : 
                     order.orderType === 'dine-in' ? `Mesa ${order.tableNumber || ''}` : 'Retirada'}
                    
                    <span className="opacity-50">•</span>
                    {new Date(order.createdAt).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Linha 2: Resumo dos Itens */}
              <div className="flex-1 bg-secondary/30 rounded-xl p-3 mb-4 space-y-1.5 border border-border/30">
                {order.items.map((item: any) => (
                  <div key={item.id} className="text-sm font-medium text-foreground flex flex-col">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground font-bold">{item.quantity}x</span>
                      <span className="truncate flex-1">{item.product.name}</span>
                    </div>
                    {/* Se o cliente adicionar customizações */}
                    {item.customizations?.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-6">
                        + {item.customizations.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Linha 3: Pagamento e Total */}
              <div className="border-t border-border/50 pt-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {PAYMENT_LABELS[order.paymentMethod as keyof typeof PAYMENT_LABELS] || order.paymentMethod}
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-primary">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* MÓDULO DE AVALIAÇÃO */}
              {hasRating && (
                <div className="mt-2 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl overflow-hidden transition-all duration-300">
                  <div 
                    onClick={() => toggleRatingDetails(order.id)}
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-amber-500/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      </div>
                      <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                        Avaliação: {getAverageRating(order.rating)}/5
                      </span>
                    </div>
                    {isRatingExpanded ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
                  </div>

                  {isRatingExpanded && order.rating && (
                    <div className="p-3 pt-0 border-t border-amber-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                      {order.rating.feedback && (
                        <div className="mb-3 bg-background/50 p-3 rounded-lg flex items-start gap-2">
                          <MessageSquareQuote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground italic leading-snug">
                            "{order.rating.feedback}"
                          </p>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wider mb-2">Detalhes</p>
                        {Object.entries(order.rating.aspects).map(([aspectId, value]) => {
                          const aspectNames: Record<string, string> = {
                            time: 'Tempo de Entrega', packaging: 'Embalagem', food: 'Sabor/Qualidade', 
                            app: 'Uso do App', speed: 'Rapidez', service: 'Atendimento',
                            waiter: 'Garçom', atmosphere: 'Ambiente'
                          };
                          
                          return (
                            <div key={aspectId} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{aspectNames[aspectId] || aspectId}</span>
                              <div className="flex items-center gap-1 font-bold text-foreground">
                                {value} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LÓGICA DE BOTÕES TOTALMENTE BLOQUEADA PARA O ADMIN APÓS "PRONTO" */}
              {order.status !== 'delivered' && (
                <div className="mt-auto pt-2">
                  {order.status === 'pending' && (
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-transform active:scale-[0.98] shadow-sm">
                      Iniciar Preparo <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-sm shadow-primary/20">
                      {order.orderType === 'delivery' ? 'Despachar / Saiu p/ Entrega' : 
                       order.orderType === 'pickup' ? 'Pronto para Retirada' : 
                       'Servir na Mesa'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* ADMIN BLOQUEADO: O cliente é quem confirma, independentemente do tipo! */}
                  {order.status === 'ready' && (
                    <div className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3.5 rounded-xl bg-secondary text-muted-foreground border border-border/50 text-center px-2">
                      <Clock className="w-4 h-4 animate-pulse shrink-0" />
                      <span>
                        {order.orderType === 'delivery' ? 'Aguardando cliente receber...' : 
                         order.orderType === 'pickup' ? 'Aguardando cliente retirar...' : 
                         'Aguardando cliente confirmar na mesa...'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;