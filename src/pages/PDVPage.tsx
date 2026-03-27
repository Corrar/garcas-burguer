import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import type { Category, PaymentMethod, Order } from '@/types';
import { toast } from 'sonner';

import { CategoryTabs } from '@/components/pdv/CategoryTabs';
import { ProductGrid } from '@/components/pdv/ProductGrid';
import { CustomizationModal } from '@/components/pdv/CustomizationModal';
import { WhatsAppModal } from '@/components/pdv/WhatsAppModal';
import { StoreHeader } from '@/components/pdv/StoreHeader';
import { PromoBanners } from '@/components/pdv/PromoBanners';
import { WelcomeModal } from '@/components/pdv/WelcomeModal';
import { CartSidebar } from '@/components/pdv/CartSidebar';
import { CartDrawer } from '@/components/pdv/CartDrawer';
import { FloatingCartButton } from '@/components/pdv/FloatingCartButton';

const PDVPage = () => {
  const { products, cart, settings, orderType, setOrderType, setTableNumber, addToCart, removeFromCart, updateCartItem, clearCart, placeOrder, getCartTotal } = useStore();
  const [searchParams] = useSearchParams();
  const tableQuery = searchParams.get('mesa');
  const [showWelcome, setShowWelcome] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (tableQuery) {
      setOrderType('dine-in');
      setTableNumber(tableQuery);
    } else if (!orderType) {
      setShowWelcome(true);
    }
  }, [tableQuery, orderType, setOrderType, setTableNumber]);

  const [activeCategory, setActiveCategory] = useState<Category>('burgers');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('app_pix');
  const [customerNotes, setCustomerNotes] = useState('');
  const [changeFor, setChangeFor] = useState('');
  const [customizeProduct, setCustomizeProduct] = useState<string | null>(null);
  
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const deliveryFee = orderType === 'delivery' ? settings.deliveryFee : 0;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)!;
    if (product.customizations?.length) {
      setCustomizeProduct(productId);
    } else {
      addToCart(product);
    }
  };

  const confirmCustomization = (removals: string[], additions: { name: string; price: number }[]) => {
    if (!customizeProduct) return;
    const product = products.find(p => p.id === customizeProduct)!;
    addToCart(product, removals, additions);
    setCustomizeProduct(null);
  };

  const handlePlaceOrder = () => {
    if (!settings.isOpen) {
      toast.error('O restaurante está fechado no momento.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Adicione itens ao pedido!');
      return;
    }
    
    let parsedChange = undefined;
    if (paymentMethod === 'delivery_cash') {
      parsedChange = parseFloat(changeFor);
      if (changeFor && parsedChange < total) {
        toast.error('Valor do troco é menor que o total do pedido!');
        return;
      }
    }

    const order = placeOrder(paymentMethod, customerNotes, deliveryFee, parsedChange);
    setCustomerNotes('');
    setChangeFor('');
    setLastOrder(order);
    toast.success(`Pedido #${order?.number} criado com sucesso!`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-background relative overflow-hidden">
      {/* Products Panel */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        <StoreHeader />
        <PromoBanners />

        <CategoryTabs 
          categories={['burgers', 'combos', 'sides', 'drinks', 'extras']}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <ProductGrid 
          products={filteredProducts}
          onAddProduct={handleAddProduct}
        />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[400px] shrink-0 border-l border-border bg-card">
        <CartSidebar 
          isOpen={settings.isOpen}
          orderType={orderType}
          cart={cart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          customerNotes={customerNotes}
          setCustomerNotes={setCustomerNotes}
          changeFor={changeFor}
          setChangeFor={setChangeFor}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={(id, qty) => updateCartItem(id, { quantity: qty })}
          onClearCart={clearCart}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      <FloatingCartButton 
        itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        total={total}
        onClick={() => setSheetOpen(true)}
      />

      <CartDrawer 
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        isOpen={settings.isOpen}
        orderType={orderType}
        cart={cart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        customerNotes={customerNotes}
        setCustomerNotes={setCustomerNotes}
        changeFor={changeFor}
        setChangeFor={setChangeFor}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={(id, qty) => updateCartItem(id, { quantity: qty })}
        onClearCart={clearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {customizeProduct && (
        <CustomizationModal
          product={products.find(p => p.id === customizeProduct)!}
          extrasCatalogue={products}
          onClose={() => setCustomizeProduct(null)}
          onConfirm={confirmCustomization}
        />
      )}

      {lastOrder && (
        <WhatsAppModal
          order={lastOrder}
          whatsappPhone={whatsappPhone}
          setWhatsappPhone={setWhatsappPhone}
          onClose={() => { setLastOrder(null); setWhatsappPhone(''); }}
        />
      )}

      {showWelcome && (
        <WelcomeModal 
          onSelect={(type, table) => {
            setOrderType(type);
            if (table) setTableNumber(table);
            setShowWelcome(false);
          }} 
        />
      )}
    </div>
  );
};

export default PDVPage;
