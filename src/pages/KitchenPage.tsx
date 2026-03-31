import { useStore } from '@/context/StoreContext';
import { STATUS_LABELS } from '@/types';
import type { OrderStatus } from '@/types';
import { Clock, ChefHat, CheckCircle2, Truck } from 'lucide-react';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  preparing: 'bg-accent/20 text-accent border-accent/30',
  ready: 'bg-success/20 text-success border-success/30',
  delivered: 'bg-muted text-muted-foreground border-border',
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  preparing: <ChefHat className="w-5 h-5" />,
  ready: <CheckCircle2 className="w-5 h-5" />,
  delivered: <Truck className="w-5 h-5" />,
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null,
};

const KitchenPage = () => {
  const { orders, updateOrderStatus } = useStore();
  const activeOrders = orders.filter(o => o.status !== 'delivered');

  return (
    <div className="p-4 lg:p-8 min-h-full">
      <h1 className="font-display text-4xl text-primary mb-6">Painel da Cozinha</h1>

      {activeOrders.length === 0 && (
        <div className="text-center py-20">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Nenhum pedido ativo</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeOrders.map(order => {
          const next = nextStatus[order.status];
          return (
            <div
              key={order.id}
              className={`glass-card p-4 border-l-4 ${statusColors[order.status]} animate-slide-in`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {statusIcons[order.status]}
                  <span className="font-display text-3xl">#{order.number}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.product.name}
                      {item.removals.length > 0 && (
                        <p className="text-xs text-accent ml-4">{item.removals.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {order.customerNotes && (
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded mb-3">
                  📝 {order.customerNotes}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {next && (
                <button
                  onClick={() => updateOrderStatus(order.id, next)}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  {next === 'preparing' ? '🔥 Iniciar Preparo' : next === 'ready' ? '✅ Marcar Pronto' : '📦 Marcar Entregue'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenPage;
