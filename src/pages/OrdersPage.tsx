import { useStore } from '@/context/StoreContext';
import { STATUS_LABELS, PAYMENT_LABELS } from '@/types';
import type { OrderStatus } from '@/types';
import { useState } from 'react';

const OrdersPage = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusColorMap: Record<OrderStatus, string> = {
    pending: 'bg-warning/20 text-warning',
    preparing: 'bg-accent/20 text-accent',
    ready: 'bg-success/20 text-success',
    delivered: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="p-4 lg:p-8 min-h-full">
      <h1 className="font-display text-4xl text-primary mb-6">Histórico de Pedidos</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['all', 'pending', 'preparing', 'ready', 'delivered'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-16">Nenhum pedido encontrado</p>
      )}

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl">#{order.number}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColorMap[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {PAYMENT_LABELS[order.paymentMethod]}
                </span>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">R$ {order.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.createdAt.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.items.map(item => (
                <span key={item.id} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {item.quantity}x {item.product.name}
                </span>
              ))}
            </div>
            {order.status !== 'delivered' && (
              <div className="mt-3 flex gap-2">
                {order.status === 'pending' && (
                  <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="text-xs px-3 py-1.5 rounded-lg bg-accent/20 text-accent hover:bg-accent/30">
                    Iniciar Preparo
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => updateOrderStatus(order.id, 'ready')} className="text-xs px-3 py-1.5 rounded-lg bg-success/20 text-success hover:bg-success/30">
                    Marcar Pronto
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-border">
                    Marcar Entregue
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
