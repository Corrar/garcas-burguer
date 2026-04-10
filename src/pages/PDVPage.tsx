import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { CustomerLoginModal } from '@/components/pdv/CustomerLoginModal';

const PDVPage = () => {
  // ADICIONADO: setDeliveryAddress extraído do estado global
  const { products, cart, settings, orderType, setOrderType, setTableNumber, setDeliveryAddress, addToCart, removeFromCart, updateCartItem, clearCart, placeOrder, getCartTotal, customer } = useStore();
  const [searchParams] = useSearchParams();
  const tableQuery = searchParams.get('mesa');
  
  const navigate = useNavigate();
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      toast.success(`${product.name} adicionado à sacola!`);
    }
  };

  const confirmCustomization = (removals: string[], additions: { name: string; price: number }[], notes: string) => {
    if (!customizeProduct) return;
    const product = products.find(p => p.id === customizeProduct)!;
    
    addToCart(product, removals, additions, notes);
    setCustomizeProduct(null);
    toast.success(`${product.name} adicionado à sacola!`);
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

    if (!customer) {
      setShowLoginModal(true);
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
    // Fundo fixo à tela (100dvh garante que no mobile a barra do Chrome não quebra a altura)
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-background relative animate-in fade-in duration-500">
      
      {/* Container principal que faz ROLAGEM (overflow-y-auto) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        
        {/* CORREÇÃO: O 'h-full' que esmagava tudo foi removido! Agora o conteúdo cresce à vontade.
            Adicionado pb-[120px] para garantir que os últimos lanches nunca fiquem escondidos */}
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 px-4 lg:px-8 pb-[120px] lg:pb-8">
          
          <StoreHeader />
          
          {/* Este bloco junta banners, abas e produtos num único fluxo */}
          <div className="flex flex-col gap-6 w-full animate-in slide-in-from-bottom-4 duration-500">
            <PromoBanners />

            {/* Menu que cola no topo ao fazer scroll */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 shadow-sm border-b border-border/50">
              <CategoryTabs 
                categories={['burgers', 'combos', 'sides', 'drinks', 'extras']}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

            <ProductGrid 
              products={filteredProducts}
              onAddProduct={handleAddProduct}
            />
          </div>
        </div>
      </main>

      {/* Sidebar (Apenas para Desktop) */}
      <aside className="hidden lg:flex w-[400px] shrink-0 border-l border-border bg-card/50 backdrop-blur-3xl shadow-2xl z-10">
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
      </aside>

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
          onClose={() => { 
            setLastOrder(null); 
            setWhatsappPhone(''); 
            navigate('/meus-pedidos'); 
          }}
        />
      )}

      {showWelcome && (
        <WelcomeModal 
          onSelect={(type, info) => {
            setOrderType(type);
            
            // Lógica inteligente: Guarda a Mesa ou o Endereço dependendo do tipo
            if (type === 'dine-in' && info) setTableNumber(info);
            if (type === 'delivery' && info) setDeliveryAddress(info);
            
            setShowWelcome(false);
          }} 
        />
      )}

      {showLoginModal && (
        <CustomerLoginModal 
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            toast.success("Pronto! Agora você pode finalizar seu pedido.");
          }}
        />
      )}
    </div>
  );
};

export default PDVPage;