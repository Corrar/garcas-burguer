import { useStore } from '@/context/StoreContext';
import { PAYMENT_LABELS } from '@/types';
import { DollarSign, ShoppingBag, TrendingUp, Award } from 'lucide-react';

const ReportsPage = () => {
  const { orders, getTodayOrders, getTodayRevenue, getPopularProducts } = useStore();
  const todayOrders = getTodayOrders();
  const todayRevenue = getTodayRevenue();
  const popular = getPopularProducts();

  const paymentBreakdown = todayOrders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'Vendas Hoje', value: `R$ ${todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Pedidos Hoje', value: todayOrders.length.toString(), icon: ShoppingBag, color: 'text-accent' },
    { label: 'Ticket Médio', value: todayOrders.length > 0 ? `R$ ${(todayRevenue / todayOrders.length).toFixed(2)}` : 'R$ 0.00', icon: TrendingUp, color: 'text-success' },
    { label: 'Total Pedidos', value: orders.length.toString(), icon: Award, color: 'text-primary' },
  ];

  return (
    <div className="p-4 lg:p-8 min-h-full">
      <h1 className="font-display text-4xl text-primary mb-6">Relatórios</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="font-display text-3xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="glass-card p-4">
          <h2 className="font-display text-2xl mb-4">Mais Vendidos</h2>
          {popular.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma venda registrada</p>}
          <div className="space-y-3">
            {popular.slice(0, 10).map(({ product, count }, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="font-display text-xl text-muted-foreground w-8">{i + 1}°</span>
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                </div>
                <span className="text-sm font-bold text-primary">{count}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="glass-card p-4">
          <h2 className="font-display text-2xl mb-4">Pagamentos Hoje</h2>
          {Object.keys(paymentBreakdown).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum pagamento hoje</p>
          )}
          <div className="space-y-3">
            {Object.entries(paymentBreakdown).map(([method, total]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm font-medium">{PAYMENT_LABELS[method as keyof typeof PAYMENT_LABELS]}</span>
                <span className="font-display text-xl text-primary">R$ {total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
