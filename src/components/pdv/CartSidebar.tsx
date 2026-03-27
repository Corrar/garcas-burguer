import React from 'react';
import { Trash2, Minus, Plus, MessageSquare, Banknote, QrCode, CreditCard, Wallet } from 'lucide-react';
import type { OrderItem, PaymentMethod, OrderType } from '@/types';

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  app_pix: <QrCode className="w-5 h-5" />,
  app_card: <CreditCard className="w-5 h-5" />,
  delivery_cash: <Banknote className="w-5 h-5" />,
  delivery_card: <Wallet className="w-5 h-5" />,
};

interface CartSidebarProps {
  isOpen: boolean;
  orderType: OrderType | null;
  cart: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerNotes: string;
  changeFor: string;
  setChangeFor: (val: string) => void;
  setCustomerNotes: (notes: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

export const CartSidebar = ({
  isOpen,
  orderType,
  cart,
  subtotal,
  deliveryFee,
  total,
  customerNotes,
  setCustomerNotes,
  changeFor,
  setChangeFor,
  paymentMethod,
  setPaymentMethod,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
}: CartSidebarProps) => {
  return (
    <div className="w-full bg-card flex flex-col h-full shadow-2xl z-20">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-2xl font-bold">Carrinho</h2>
        <p className="text-sm text-muted-foreground">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum item adicionado</p>
        )}
        {cart.map(item => {
          const itemTotal = (item.unitPrice + (item.additions?.reduce((acc, add) => acc + add.price, 0) || 0)) * item.quantity;
          
          return (
            <div key={item.id} className="bg-secondary rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-sm truncate">{item.product.name}</p>
                  {item.removals && item.removals.length > 0 && (
                    <p className="text-xs text-destructive mt-0.5">
                      S/ {item.removals.join(', ')}
                    </p>
                  )}
                  {item.additions && item.additions.length > 0 && (
                    <p className="text-xs text-primary mt-0.5">
                      + {item.additions.map(a => a.name).join(', ')}
                    </p>
                  )}
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 bg-background rounded-lg border border-border p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-bold text-base text-foreground">R$ {itemTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="px-6 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Observações</span>
        </div>
        <textarea
          value={customerNotes}
          onChange={e => setCustomerNotes(e.target.value)}
          placeholder="Ex: Sem cebola, por favor..."
          className="w-full bg-secondary border border-border rounded-xl p-3 text-sm resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Payment */}
      <div className="px-6 pb-2 space-y-4">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Pagar pelo App</p>
          <div className="grid grid-cols-2 gap-2">
            {(['app_pix', 'app_card'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === method
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {paymentIcons[method]}
                  <span className="font-semibold text-xs">{method === 'app_pix' ? 'PIX' : 'Cart. Crédito'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Pagar na Entrega</p>
          <div className="grid grid-cols-2 gap-2">
            {(['delivery_cash', 'delivery_card'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === method
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {paymentIcons[method]}
                  <span className="font-semibold text-xs truncate w-full text-left">{method === 'delivery_cash' ? 'Dinheiro' : 'Maquininha'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {paymentMethod === 'delivery_cash' && (
          <div className="bg-secondary/50 border border-border rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-bold mb-2">Precisa de troco para quanto?</p>
            <div className="flex items-center gap-2">
              <span className="font-bold">R$</span>
              <input
                type="number"
                value={changeFor}
                onChange={e => setChangeFor(e.target.value)}
                placeholder="Ex: 50"
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
            {changeFor && parseFloat(changeFor) < total && (
              <p className="text-xs text-destructive font-medium mt-1">Valor menor que o total do pedido.</p>
            )}
          </div>
        )}
      </div>

      {/* Order Summary & Confirm */}
      <div className="p-6 border-t border-border space-y-4 bg-background z-10 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span className="font-medium">Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Taxa de Entrega</span>
              <span className={deliveryFee === 0 ? "text-success font-bold" : ""}>
                {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <span className="font-bold">Total a Pagar</span>
          <span className="text-2xl font-display font-bold text-primary">R$ {total.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          {!isOpen && (
            <p className="text-sm font-bold text-destructive text-center mb-1">
              Restaurante Fechado no Momento
            </p>
          )}
          <button
            onClick={onPlaceOrder}
            disabled={!isOpen}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-transform active:scale-[0.98] shadow-lg ${
              isOpen 
                ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/25' 
                : 'bg-muted text-muted-foreground opacity-70 cursor-not-allowed shadow-none'
            }`}
          >
            Fazer pedido
          </button>
        </div>
      </div>
    </div>
  );
};
