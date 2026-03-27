import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category, PaymentMethod } from '@/types';
import { CATEGORY_LABELS, PAYMENT_LABELS } from '@/types';
import { Plus, Minus, Trash2, CreditCard, Banknote, QrCode, X, ShoppingBag, Flame, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import burgerHero from '@/assets/burger-hero.jpg';

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  cash: <Banknote className="w-6 h-6" />,
  pix: <QrCode className="w-6 h-6" />,
  card: <CreditCard className="w-6 h-6" />,
};

type KioskStep = 'menu' | 'cart' | 'payment' | 'confirmed';

const KioskPage = () => {
  const { products, cart, addToCart, removeFromCart, updateCartItem, clearCart, placeOrder, getCartTotal } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category>('burgers');
  const [step, setStep] = useState<KioskStep>('menu');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [customerNotes, setCustomerNotes] = useState('');
  const [customizeProduct, setCustomizeProduct] = useState<string | null>(null);
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<number | null>(null);

  const categories: Category[] = ['burgers', 'combos', 'sides', 'drinks', 'extras'];
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const total = getCartTotal();

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)!;
    if (product.customizations?.length) {
      setCustomizeProduct(productId);
      setSelectedRemovals([]);
    } else {
      addToCart(product);
      toast.success(`${product.name} adicionado!`);
    }
  };

  const confirmCustomization = () => {
    if (!customizeProduct) return;
    const product = products.find(p => p.id === customizeProduct)!;
    addToCart(product, selectedRemovals);
    setCustomizeProduct(null);
    setSelectedRemovals([]);
    toast.success(`${product.name} adicionado!`);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    const order = placeOrder(paymentMethod, customerNotes);
    setConfirmedOrderNumber(order.number);
    setCustomerNotes('');
    setStep('confirmed');
  };

  const handleNewOrder = () => {
    setStep('menu');
    setConfirmedOrderNumber(null);
    setActiveCategory('burgers');
  };

  // Confirmed screen
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto animate-pulse-glow">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="font-display text-6xl text-primary">#{confirmedOrderNumber}</h1>
          <p className="font-display text-3xl">Pedido Confirmado!</p>
          <p className="text-muted-foreground">Seu pedido está sendo preparado. Aguarde ser chamado pelo número acima.</p>
          <button
            onClick={handleNewOrder}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
          >
            Novo Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step !== 'menu' && (
            <button onClick={() => setStep(step === 'payment' ? 'cart' : 'menu')} className="p-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
          <span className="font-display text-2xl text-primary">BURGER HOUSE</span>
        </div>
        <button
          onClick={() => setStep('cart')}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-display text-lg">R$ {total.toFixed(2)}</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {step === 'menu' && (
        <div className="flex-1 flex flex-col">
          {/* Hero */}
          <div className="relative h-40 overflow-hidden">
            <img src={burgerHero} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <h1 className="font-display text-4xl text-primary">Faça seu Pedido</h1>
              <p className="text-sm text-muted-foreground">Escolha seus itens e monte seu lanche</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => handleAddProduct(product.id)}
                className="glass-card overflow-hidden text-left hover:border-primary/50 transition-all group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.popular && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                      <Flame className="w-3 h-3" /> Popular
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-display text-2xl text-primary">R$ {product.price.toFixed(2)}</span>
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'cart' && (
        <div className="flex-1 flex flex-col p-4 lg:p-8 max-w-2xl mx-auto w-full">
          <h2 className="font-display text-3xl mb-4">Seu Pedido</h2>
          
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">Seu carrinho está vazio</p>
              <button onClick={() => setStep('menu')} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                Ver Cardápio
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.product.name}</p>
                      {item.removals.length > 0 && (
                        <p className="text-xs text-accent">{item.removals.join(', ')}</p>
                      )}
                      <p className="text-sm text-primary font-bold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) removeFromCart(item.id);
                          else updateCartItem(item.id, { quantity: item.quantity - 1 });
                        }}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted"
                      >
                        {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Alguma observação?</span>
                </div>
                <textarea
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Sem cebola, ponto da carne..."
                  className="w-full bg-secondary rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="mt-4 p-4 bg-card border border-border rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-xl">TOTAL</span>
                  <span className="font-display text-3xl text-primary">R$ {total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-amber hover:bg-primary/90 transition-colors"
                >
                  Escolher Pagamento
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 'payment' && (
        <div className="flex-1 flex flex-col p-4 lg:p-8 max-w-md mx-auto w-full">
          <h2 className="font-display text-3xl mb-6">Pagamento</h2>
          <p className="text-muted-foreground mb-4">Escolha a forma de pagamento:</p>

          <div className="space-y-3 mb-8">
            {(['card', 'pix', 'cash'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  paymentMethod === method ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {paymentIcons[method]}
                </div>
                <span className="font-display text-xl">{PAYMENT_LABELS[method]}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 bg-card border border-border rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-xl">TOTAL</span>
              <span className="font-display text-3xl text-primary">R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-amber hover:bg-primary/90 transition-colors"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizeProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-2xl">Personalizar</h3>
              <button onClick={() => setCustomizeProduct(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {products.find(p => p.id === customizeProduct)?.customizations?.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRemovals.includes(opt)}
                    onChange={e => {
                      if (e.target.checked) setSelectedRemovals(prev => [...prev, opt]);
                      else setSelectedRemovals(prev => prev.filter(r => r !== opt));
                    }}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={confirmCustomization}
              className="w-full mt-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskPage;
