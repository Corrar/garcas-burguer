import React, { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Minus, Plus, MessageSquare, Banknote, QrCode, CreditCard, Wallet, ShoppingBag, Sparkles, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { OrderItem, PaymentMethod, OrderType } from '@/types';
import { toast } from 'sonner';

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  app_pix: <QrCode className="w-5 h-5" />,
  app_card: <CreditCard className="w-5 h-5" />,
  delivery_cash: <Banknote className="w-5 h-5" />,
  delivery_card: <Wallet className="w-5 h-5" />,
};

interface CartDrawerProps {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  isOpen: boolean;
  orderType: OrderType | null;
  cart: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  changeFor: string;
  setChangeFor: (val: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

export const CartDrawer = ({
  sheetOpen,
  setSheetOpen,
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
}: CartDrawerProps) => {

  // Extraímos os produtos e a função de adicionar do Contexto Global
  const { products, addToCart } = useStore();

  // Lógica Inteligente de Upsell (Aproveite e leve também)
  const suggestedProducts = useMemo(() => {
    const cartProductIds = cart.map(item => item.product.id);
    
    return products
      .filter(p => ['drinks', 'sides', 'extras'].includes(p.category))
      .filter(p => !cartProductIds.includes(p.id))
      .filter(p => !p.customizations || p.customizations.length === 0)
      .slice(0, 4);
  }, [cart, products]);

  const handleQuickAdd = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} adicionado!`);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side="bottom" className="z-[60] h-[90vh] sm:h-[85vh] p-0 flex flex-col bg-background rounded-t-2xl max-w-md mx-auto right-0 left-0">
        <SheetHeader className="p-4 border-b border-border text-left shrink-0">
          <SheetTitle className="font-display text-2xl text-primary">Sua Sacola</SheetTitle>
          <p className="text-sm text-muted-foreground">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          
          <div className="space-y-3">
            {cart.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhum item adicionado</p>
            )}
            {cart.map(item => {
              const itemTotal = (item.unitPrice + (item.additions?.reduce((acc, add) => acc + add.price, 0) || 0)) * item.quantity;
              
              return (
                <div key={item.id} className="bg-secondary rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-semibold text-base truncate">{item.product.name}</p>
                      {item.removals && item.removals.length > 0 && (
                        <p className="text-xs text-destructive mt-1 font-medium">
                          S/ {item.removals.join(', ')}
                        </p>
                      )}
                      {item.additions && item.additions.length > 0 && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          + {item.additions.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md bg-background shadow-sm border border-border">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border text-foreground transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border text-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-lg text-foreground">R$ {itemTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VITRINE DE UPSELL: Aproveite e leve também */}
          {cart.length > 0 && suggestedProducts.length > 0 && (
            <div className="pt-2 pb-2 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                Aproveite e leve também
              </h3>
              
              <div className="flex gap-3 overflow-x-auto pb-4 pt-1 -mx-4 px-4 custom-scrollbar">
                {suggestedProducts.map(product => (
                  <div key={product.id} className="min-w-[130px] max-w-[130px] bg-secondary border border-border/50 rounded-xl p-3 shadow-sm flex flex-col justify-between group">
                    <div>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-20 object-cover rounded-lg mb-2 bg-background" loading="lazy" />
                      ) : (
                        <div className="w-full h-20 bg-background rounded-lg mb-2 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                      <p className="font-bold text-xs text-foreground line-clamp-2 leading-tight mb-1">{product.name}</p>
                      <p className="text-xs font-bold text-muted-foreground">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleQuickAdd(product)}
                      className="mt-3 w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-6">
              {/* Notes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Observações do Pedido</span>
                </div>
                <textarea
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Sem cebola, enviar sachês..."
                  className="w-full bg-card border border-border rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm custom-scrollbar"
                />
              </div>

              {/* Payment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Forma de Pagamento</h3>
                
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pagar pelo App</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(['app_pix', 'app_card'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          paymentMethod === method
                            ? 'border-primary bg-primary/10 text-primary scale-[1.02]'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <div className="mb-2">
                          {paymentIcons[method]}
                        </div>
                        <span className="font-bold text-sm text-center tracking-tight">
                          {method === 'app_pix' ? 'PIX Rápido' : 'Cart. Crédito'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pagar na Entrega/Loja</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(['delivery_cash', 'delivery_card'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          paymentMethod === method
                            ? 'border-primary bg-primary/10 text-primary scale-[1.02]'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <div className="mb-2">
                          {paymentIcons[method]}
                        </div>
                        <span className="font-bold text-sm text-center tracking-tight">
                          {method === 'delivery_cash' ? 'Dinheiro' : 'Maquininha'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {paymentMethod === 'delivery_cash' && (
                  <div className="bg-secondary/80 border border-border rounded-xl p-4 animate-in fade-in slide-in-from-top-2 mt-4">
                    <p className="text-sm font-bold mb-2">Vai precisar de troco?</p>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">R$</span>
                      <input
                        type="number"
                        value={changeFor}
                        onChange={e => setChangeFor(e.target.value)}
                        placeholder="Ex: 100"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      />
                    </div>
                    {changeFor && parseFloat(changeFor) < total && (
                      <p className="text-xs text-destructive font-semibold mt-2">Valor menor que o total do pedido.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary & Confirm */}
        <div className="p-4 bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] shrink-0 space-y-3 pb-6 sm:pb-4">
          <div className="space-y-1 text-sm font-medium">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de Entrega</span>
                <span className={deliveryFee === 0 ? "text-success font-bold" : ""}>
                  {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border shadow-sm">
            <span className="font-bold text-base">Total a pagar</span>
            <span className="text-2xl font-display font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex flex-col gap-2 pt-1">
            {!isOpen && (
              <div className="bg-destructive/10 text-destructive text-sm font-bold text-center py-2 rounded-lg">
                Restaurante Fechado no Momento
              </div>
            )}
            <button
              onClick={() => {
                onPlaceOrder();
                if (isOpen && cart.length > 0) setSheetOpen(false);
              }}
              disabled={!isOpen || cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                isOpen && cart.length > 0
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25' 
                  : 'bg-muted text-muted-foreground opacity-70 cursor-not-allowed shadow-none'
              }`}
            >
              Confirmar Pedido <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};