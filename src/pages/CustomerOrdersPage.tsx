import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { STATUS_LABELS } from '@/types';
import type { Order } from '@/types';
import { CheckCircle2, Clock, ChefHat, PackageOpen, ArrowLeft, Bike, Store, Timer, Star, Flame, ClipboardList, Utensils, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { OrderRatingModal } from '@/components/pdv/OrderRatingModal';

export const CustomerOrdersPage = () => {
  const { orders, settings, rateOrder, updateOrderStatus } = useStore();
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);
  const myOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatTime = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getAverageRating = (rating: any) => {
    if (!rating || !rating.aspects) return 0;
    const values = Object.values(rating.aspects) as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  const getEstimatedDelivery = (createdAt: Date | string, estimateString: string) => {
    const date = new Date(createdAt);
    const match = estimateString.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
      const min = parseInt(match[1], 10);
      const max = parseInt(match[2], 10);
      const minDate = new Date(date.getTime() + min * 60000);
      const maxDate = new Date(date.getTime() + max * 60000);
      return `${formatTime(minDate)} - ${formatTime(maxDate)}`;
    }
    return estimateString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'preparing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'ready': return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-secondary text-foreground border-border';
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <>
      {/* CSS Mágico para a animação estilo iFood */}
      <style>{`
        @keyframes move-stripes {
          from { background-position: 0 0; }
          to { background-position: 2rem 0; }
        }
        .progress-striped {
          background-image: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.25) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.25) 75%,
            transparent 75%,
            transparent
          );
          background-size: 2rem 2rem;
          animation: move-stripes 1s linear infinite;
        }
      `}</style>

      <div className="min-h-[100dvh] bg-background pb-28">
        <header className="bg-card border-b border-border/50 px-4 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
          <NavLink to="/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
          <h1 className="font-display font-bold text-xl text-foreground">Meus Pedidos</h1>
        </header>

        <div className="p-4 max-w-2xl mx-auto space-y-5">
          {myOrders.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-5 text-muted-foreground">
                <PackageOpen className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-2xl text-foreground">Nenhum pedido</h3>
              <p className="text-muted-foreground mt-2 text-lg">Bateu aquela fome? Peça agora!</p>
              <NavLink to="/" className="mt-8 inline-block px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all">
                Ver Cardápio
              </NavLink>
            </div>
          ) : (
            myOrders.map(order => {
              const currentStep = getStepIndex(order.status);
              const type = order.orderType || 'pickup';

              // Definição dos passos Nível iFood
              const stepsConfig = [
                { id: 1, label: 'Confirmado', icon: <ClipboardList className="w-5 h-5" /> },
                { id: 2, label: 'Preparando', icon: <Flame className="w-5 h-5 animate-pulse" /> },
                { 
                  id: 3, 
                  label: type === 'delivery' ? 'A Caminho' : type === 'pickup' ? 'Pronto' : 'Na Mesa', 
                  icon: type === 'delivery' ? <Bike className="w-5 h-5 animate-bounce" /> : type === 'dine-in' ? <Utensils className="w-5 h-5 animate-bounce" /> : <Store className="w-5 h-5 animate-pulse" /> 
                },
                { id: 4, label: 'Entregue', icon: <CheckCircle2 className="w-5 h-5" /> }
              ];

              return (
                <div key={order.id} className="bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  <div className="flex items-start justify-between border-b border-border/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center border border-border/50">
                        {type === 'delivery' ? <Bike className="w-6 h-6 text-primary" /> : 
                         type === 'dine-in' ? <Utensils className="w-6 h-6 text-primary" /> :
                         <Store className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Pedido #{order.number}</h3>
                        <p className="text-sm text-muted-foreground">
                          {type === 'delivery' ? 'Entrega' : type === 'dine-in' ? `Mesa ${order.tableNumber}` : 'Retirada'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                      <span className="font-bold text-[13px] uppercase tracking-wide">{STATUS_LABELS[order.status]}</span>
                    </div>
                  </div>

                  <div className="flex bg-secondary/50 rounded-2xl p-4 gap-4 border border-border/30">
                    <div className="flex-1 border-r border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Início</p>
                      <p className="font-bold text-foreground flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex-1 pl-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        {order.status === 'delivered' ? 'Concluído às' : 'Previsão'}
                      </p>
                      <p className={`font-bold flex items-center gap-1.5 ${order.status !== 'delivered' ? 'text-primary' : 'text-foreground'}`}>
                        {order.status === 'delivered' ? (
                          formatTime(order.updatedAt)
                        ) : (
                          getEstimatedDelivery(order.createdAt, settings.estimatedDeliveryTime)
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ==================================================== */}
                  {/* BARRA DE PROGRESSO NÍVEL IFOOD (COM LISTRAS)         */}
                  {/* ==================================================== */}
                  <div className="py-2">
                    <div className="relative z-0">
                      
                      {/* Trilha de fundo (Cinza) - Posicionada perfeitamente no centro dos ícones */}
                      <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1.5 bg-secondary rounded-full -z-10" />

                      {/* Segmentos Dinâmicos de Carregamento */}
                      {[1, 2, 3].map(seg => {
                        // Verifica o status de cada um dos 3 segmentos de linha
                        const isCompleted = currentStep > seg || order.status === 'delivered';
                        const isInProgress = currentStep === seg + 1 && order.status !== 'delivered';
                        
                        let width = '0%';
                        let extraClasses = '';
                        
                        if (isCompleted) {
                          width = '100%'; // Linha sólida preenchida
                        } else if (isInProgress) {
                          width = '100%'; // Linha preenchida MAS com a animação de listras!
                          extraClasses = 'progress-striped';
                        }

                        return (
                          <div 
                            key={seg} 
                            className="absolute top-5 h-1.5 -z-10 overflow-hidden rounded-full"
                            style={{ left: `${12.5 + (seg - 1) * 25}%`, width: '25%' }}
                          >
                            <div 
                              className={`h-full bg-primary transition-all duration-700 ease-out ${extraClasses}`} 
                              style={{ width }} 
                            />
                          </div>
                        );
                      })}

                      {/* Os Pontos/Ícones */}
                      <div className="flex justify-between relative">
                        {stepsConfig.map((step) => {
                          const isPast = step.id < currentStep;
                          const isCurrent = step.id === currentStep && order.status !== 'delivered';
                          const isDelivered = step.id === 4 && order.status === 'delivered';
                          const isActive = isPast || isCurrent || isDelivered;

                          return (
                            <div key={step.id} className="flex flex-col items-center w-1/4">
                              
                              {/* O Círculo Mágico */}
                              <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 mb-3 z-10 ${
                                isCurrent
                                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,30,61,0.5)] ring-4 ring-primary/20 scale-110'
                                  : isDelivered
                                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500/20 scale-110'
                                  : isPast
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border-2 border-border text-muted-foreground'
                              }`}>
                                
                                {/* Lógica do Ícone */}
                                {isPast && !isDelivered ? (
                                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                                ) : isCurrent || isDelivered ? (
                                  step.icon
                                ) : (
                                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                )}
                              </div>

                              {/* O Texto do Estado */}
                              <span className={`text-[10px] md:text-xs font-bold text-center leading-tight transition-colors duration-300 ${
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </span>

                              {/* A etiqueta de "Agora" */}
                              {isCurrent && (
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1.5 animate-pulse">
                                  Agora
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* ==================================================== */}

                  <div className="bg-secondary/30 rounded-2xl p-4 border border-border/50 flex flex-col">
                    <div className="space-y-2 mb-4">
                      <p className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">Detalhes</p>
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-[15px]">
                          <span className="text-muted-foreground"><span className="font-bold text-foreground">{item.quantity}x</span> {item.product.name}</span>
                          <span className="font-medium text-foreground">R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                      <span className="font-bold text-foreground">Total Pago</span>
                      <span className="font-black text-xl text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>

                    {/* AÇÕES DE CONFIRMAÇÃO DO CLIENTE */}
                    <div className="pt-4 mt-4 border-t border-border/50">
                      
                      {order.status === 'ready' && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col gap-3 animate-in zoom-in-95 duration-300">
                          <div className="flex items-center gap-2 text-primary justify-center">
                            {type === 'delivery' ? <PackageOpen className="w-5 h-5" /> : 
                             type === 'dine-in' ? <Utensils className="w-5 h-5" /> : 
                             <ShoppingBag className="w-5 h-5" />}
                             
                            <span className="font-bold text-sm">
                              {type === 'delivery' ? 'O entregador já chegou?' :
                               type === 'dine-in' ? 'Seu pedido chegou na mesa?' :
                               'Seu pedido está no balcão!'}
                            </span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              updateOrderStatus(order.id, 'delivered');
                              setOrderToRate({ ...order, status: 'delivered' });
                            }}
                            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            {type === 'delivery' ? 'Marcar como Recebido' :
                             type === 'dine-in' ? 'Recebi na Mesa' :
                             'Já retirei meu pedido'}
                          </button>
                        </div>
                      )}

                      {/* Avaliação Normal */}
                      {order.status === 'delivered' && (
                        <div className="mt-2">
                          {!order.rating ? (
                            <div className="flex items-center justify-between bg-background border border-border/50 rounded-xl p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                  <Star className="w-4 h-4 text-amber-500" />
                                </div>
                                <span className="text-sm font-bold text-foreground">Como foi a experiência?</span>
                              </div>
                              <button 
                                onClick={() => setOrderToRate(order)}
                                className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors active:scale-95 shadow-sm"
                              >
                                Avaliar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-3">
                              <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Avaliação enviada
                              </span>
                              <div className="flex items-center gap-1 bg-background border border-border px-3 py-1.5 rounded-lg">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-bold text-foreground">{getAverageRating(order.rating)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {orderToRate && (
          <OrderRatingModal
            order={orderToRate}
            onClose={() => setOrderToRate(null)}
            onSubmit={(ratings, feedback) => {
              rateOrder(orderToRate.id, ratings, feedback);
            }}
          />
        )}
      </div>
    </>
  );
};