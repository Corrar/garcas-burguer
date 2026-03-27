import React from 'react';
import { Trash2, Minus, Plus, MessageSquare, Banknote, QrCode, CreditCard, Wallet, ShoppingBag } from 'lucide-react';
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
    <div className="w-full bg-background flex flex-col h-full shadow-2xl z-20 border-l border-border/50">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-border/50 bg-card shrink-0">
        <h2 className="font-display text-2xl font-bold text-foreground">Sua Sacola</h2>
        <p className="text-sm text-muted-foreground font-medium">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-secondary/10">
        
        {/* Lista de Itens */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-in fade-in">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold text-center text-lg">Sua sacola está vazia</p>
              <p className="text-sm text-center">Que tal adicionar um hambúrguer?</p>
            </div>
          ) : (
            cart.map(item => {
              const itemTotal = (item.unitPrice + (item.additions?.reduce((acc, add) => acc + add.price, 0) || 0)) * item.quantity;
              
              return (
                <div key={item.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-sm leading-tight text-foreground">{item.product.name}</p>
                      <div className="mt-1 space-y-0.5">
                        {item.removals && item.removals.length > 0 && (
                          <p className="text-xs text-destructive font-medium">Sem: {item.removals.join(', ')}</p>
                        )}
                        {item.additions && item.additions.length > 0 && (
                          <p className="text-xs text-primary font-medium">Com: {item.additions.map(a => a.name).join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-base text-foreground">R$ {itemTotal.toFixed(2).replace('.', ',')}</span>
                    
                    <div className="flex items-center gap-1 bg-secondary rounded-full p-1 border border-border/50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm hover:text-primary transition-colors active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm hover:text-primary transition-colors active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Formulários e Pagamentos só aparecem se tiver itens na sacola */}
        {cart.length > 0 && (
          <div className="space-y-6 animate-in fade-in">
            {/* Observações */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Observações</span>
              </div>
              <textarea
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                placeholder="Ex: Sem cebola, enviar 2 sachês..."
                className="w-full bg-card border border-border/50 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
              />
            </div>

            {/* Pagamento */}
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider pl-1">Pagar pelo App</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['app_pix', 'app_card'] as PaymentMethod[]).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === method
                          ? 'border-primary bg-primary/10 text-primary scale-[1.02] shadow-sm'
                          : 'border-border/50 bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="mb-1">{paymentIcons[method]}</div>
                      <span className="font-bold text-xs">{method === 'app_pix' ? 'PIX' : 'Cartão App'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider pl-1">Pagar na Entrega</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['delivery_cash', 'delivery_card'] as PaymentMethod[]).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === method
                          ? 'border-primary bg-primary/10 text-primary scale-[1.02] shadow-sm'
                          : 'border-border/50 bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="mb-1">{paymentIcons[method]}</div>
                      <span className="font-bold text-xs text-center w-full truncate">{method === 'delivery_cash' ? 'Dinheiro' : 'Maquininha'}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {paymentMethod === 'delivery_cash' && (
                <div className="bg-card border border-border/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <p className="text-sm font-bold mb-2 text-foreground">Troco para quanto?</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">R$</span>
                    <input
                      type="number"
                      value={changeFor}
                      onChange={e => setChangeFor(e.target.value)}
                      placeholder="Ex: 50"
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  {changeFor && parseFloat(changeFor) < total && (
                    <p className="text-xs text-destructive font-bold mt-2">Valor menor que o total.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resumo Final Fixo na Base */}
      <div className="p-6 border-t border-border/50 bg-card shrink-0 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex justify-between font-medium">
              <span className="text-muted-foreground">Taxa de Entrega</span>
              <span className={deliveryFee === 0 ? "text-success font-bold" : "text-muted-foreground"}>
                {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-foreground">Total a Pagar</span>
          <span className="text-2xl font-display font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          {!isOpen && (
            <p className="text-sm font-bold text-destructive text-center py-2 bg-destructive/10 rounded-lg">
              Restaurante Fechado no Momento
            </p>
          )}
          <button
            onClick={onPlaceOrder}
            disabled={!isOpen || cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] ${
              isOpen && cart.length > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30' 
                : 'bg-secondary text-muted-foreground cursor-not-allowed shadow-none'
            }`}
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
