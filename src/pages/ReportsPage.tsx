import React, { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { PAYMENT_LABELS } from '@/types';
import { DollarSign, ShoppingBag, TrendingUp, Award, Star, MessageSquareHeart } from 'lucide-react';

const ReportsPage = () => {
  // 1. Extraímos as funções e dados do nosso estado global
  const { orders, getTodayOrders, getTodayRevenue, getPopularProducts } = useStore();
  
  // 2. Executamos as funções com um fallback de segurança
  const todayOrders = getTodayOrders ? getTodayOrders() : [];
  const todayRevenue = getTodayRevenue ? getTodayRevenue() : 0;
  const popular = getPopularProducts ? getPopularProducts() : [];

  // 3. Calculamos o total por método de pagamento
  const paymentBreakdown = todayOrders.reduce((acc, o) => {
    const method = o.paymentMethod || 'cash';
    acc[method] = (acc[method] || 0) + (o.total || 0);
    return acc;
  }, {} as Record<string, number>);

  // 4. LÓGICA DE AVALIAÇÕES (Média Geral e Comentários Recentes)
  const ratingsData = useMemo(() => {
    let totalScore = 0;
    let reviewCount = 0;
    const allComments: Array<{ id: string, name: string, date: string, note: string, rating: number }> = [];

    // Vasculha todos os pedidos (do mais recente para o mais antigo)
    [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).forEach(order => {
      if (order.rating && order.rating.aspects) {
        const aspectValues = Object.values(order.rating.aspects) as number[];
        if (aspectValues.length > 0) {
          const avgAspect = aspectValues.reduce((a, b) => a + b, 0) / aspectValues.length;
          totalScore += avgAspect;
          reviewCount++;

          // Se tiver um comentário escrito, guarda para mostrarmos no relatório
          if (order.rating.feedback && order.rating.feedback.trim() !== '') {
            allComments.push({
              id: order.id,
              name: `Pedido #${order.number || order.id.slice(0, 5)}`,
              date: new Date(order.rating.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              note: order.rating.feedback,
              rating: Number(avgAspect.toFixed(1))
            });
          }
        }
      }
    });

    const average = reviewCount > 0 ? (totalScore / reviewCount).toFixed(1) : '0.0';
    return { average, count: reviewCount, comments: allComments };
  }, [orders]);

  // 5. Estruturamos os dados dos cartões superiores
  const stats = [
    { label: 'Vendas Hoje', value: `R$ ${todayRevenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pedidos Hoje', value: todayOrders.length.toString(), icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ticket Médio', value: todayOrders.length > 0 ? `R$ ${(todayRevenue / todayOrders.length).toFixed(2).replace('.', ',')}` : 'R$ 0,00', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Nota Geral', value: ratingsData.average, subtext: `${ratingsData.count} avaliações`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in pb-24">
      
      {/* Cabeçalho */}
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Acompanhe as vendas, desempenho e satisfação dos clientes</p>
      </div>

      {/* Grid de Estatísticas (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(({ label, value, subtext, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-black mt-1.5 flex items-baseline gap-2">
                  {value}
                  {label === 'Nota Geral' && value !== '0.0' && <Star className="w-4 h-4 text-amber-500 fill-amber-500 mb-1" />}
                </h3>
                {subtext && <p className="text-xs text-muted-foreground font-medium mt-1">{subtext}</p>}
              </div>
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção Intermediária: Avaliações e Produtos Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Bloco Novo: Últimas Avaliações (Ocupa 2 colunas no desktop) */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-primary" /> Feedbacks Recentes
            </h2>
          </div>

          <div className="flex-1">
            {ratingsData.comments.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center bg-secondary/30 rounded-xl border border-dashed border-border/50">
                <Star className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Nenhum comentário recebido ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ratingsData.comments.slice(0, 4).map((comment) => (
                  <div key={comment.id} className="bg-secondary/20 border border-border/40 rounded-xl p-4 flex flex-col justify-between hover:bg-secondary/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{comment.name} • {comment.date}</span>
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{comment.rating}</span>
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-snug italic line-clamp-3">"{comment.note}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bloco: Divisão de Pagamentos */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col">
          <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-5">Pagamentos (Hoje)</h2>
          
          <div className="flex-1">
            {Object.keys(paymentBreakdown).length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center bg-secondary/30 rounded-xl border border-dashed border-border/50">
                <p className="text-sm font-medium text-muted-foreground">Sem dados para hoje.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(paymentBreakdown).map(([method, total]) => (
                  <div key={method} className="flex items-center justify-between p-3.5 bg-secondary/30 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/70"></div>
                      <span className="text-sm font-bold text-muted-foreground">
                        {PAYMENT_LABELS[method as keyof typeof PAYMENT_LABELS] || method}
                      </span>
                    </div>
                    <span className="text-base font-bold text-foreground">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Seção Inferior: Produtos Mais Vendidos (Geral) */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-5">Top Produtos (Mais Vendidos)</h2>
        
        {popular.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center bg-secondary/30 rounded-xl border border-dashed border-border/50">
            <p className="text-sm font-medium text-muted-foreground">O ranking aparecerá após as primeiras vendas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.slice(0, 9).map(({ product, count }, i) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-secondary/10 border border-border/30 rounded-xl hover:border-primary/30 hover:bg-secondary/30 transition-all group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}º
                </div>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-sm" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-secondary shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{count} unidades vendidas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ReportsPage;