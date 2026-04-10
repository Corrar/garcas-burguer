import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { 
  Product, 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  StoreSettings, 
  PromoBanner, 
  OrderType 
} from '@/types';

// Gerador de ID local
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export interface Customer {
  name: string;
  phone: string;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  cart: OrderItem[];
  nextOrderNumber: number;
  settings: StoreSettings;
  promoBanners: PromoBanner[];
  orderType: OrderType | null;
  tableNumber: string | null;
  deliveryAddress: string | null;
  customer: Customer | null;
}

interface StoreContextType extends StoreState {
  setOrderType: (type: OrderType | null) => void;
  setTableNumber: (table: string | null) => void;
  setDeliveryAddress: (address: string | null) => void;
  setCustomer: (customer: Customer | null) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addPromoBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  updatePromoBanner: (id: string, updates: Partial<PromoBanner>) => void;
  removePromoBanner: (id: string) => void;
  addToCart: (product: Product, removals?: string[], additions?: { name: string; price: number }[], notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<OrderItem>) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: PaymentMethod, customerNotes: string, deliveryFee: number, changeFor?: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  rateOrder: (orderId: string, ratings: Record<string, number>, feedback: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getCartTotal: () => number;
  getTodayOrders: () => Order[];
  getTodayRevenue: () => number;
  getPopularProducts: () => { product: Product; count: number }[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // =========================================================
  // 1. ESTADOS DO SERVIDOR (GERIDOS PELO REACT QUERY)
  // =========================================================
  
  const { data: products = [] } = useQuery({ 
    queryKey: ['products'], 
    queryFn: api.getProducts 
  });

  const { data: settings = { isOpen: true, deliveryFee: 5.99, estimatedDeliveryTime: '30-40 min', minimumOrderValue: 0 } as StoreSettings } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: api.getSettings 
  });

  const { data: promoBanners = [] } = useQuery({ 
    queryKey: ['banners'], 
    queryFn: api.getBanners 
  });

  // O React Query faz polling inteligente a cada 10 segundos! Sem bloquear a UI.
  const { data: orders = [] } = useQuery({ 
    queryKey: ['orders'], 
    queryFn: api.getOrders,
    refetchInterval: 10000 
  });

  const nextOrderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.number)) + 1 : 1;

  // =========================================================
  // 2. ESTADOS LOCAIS DO CLIENTE (LOCALSTORAGE)
  // =========================================================
  
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('@burger-buddy:cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orderType, setOrderType] = useState<OrderType | null>(() => localStorage.getItem('@burger-buddy:orderType') as OrderType | null);
  const [tableNumber, setTableNumber] = useState<string | null>(() => localStorage.getItem('@burger-buddy:tableNumber'));
  const [deliveryAddress, setDeliveryAddress] = useState<string | null>(() => localStorage.getItem('@burger-buddy:deliveryAddress'));
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('@burger-buddy:customer');
    return saved ? JSON.parse(saved) : null;
  });

  // Sincronização Local
  useEffect(() => { localStorage.setItem('@burger-buddy:cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (orderType) localStorage.setItem('@burger-buddy:orderType', orderType); }, [orderType]);
  useEffect(() => { if (tableNumber) localStorage.setItem('@burger-buddy:tableNumber', tableNumber); }, [tableNumber]);
  useEffect(() => { if (deliveryAddress) localStorage.setItem('@burger-buddy:deliveryAddress', deliveryAddress); }, [deliveryAddress]);
  useEffect(() => { if (customer) localStorage.setItem('@burger-buddy:customer', JSON.stringify(customer)); }, [customer]);


  // =========================================================
  // 3. FUNÇÕES DO CARRINHO (LOCAIS)
  // =========================================================
  
  const addToCart = useCallback((product: Product, removals: string[] = [], additions: { name: string; price: number }[] = [], notes = '') => {
    const item: OrderItem = { id: generateId(), product, quantity: 1, removals, additions, notes, unitPrice: product.price };
    setCart(prev => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((itemId: string) => { setCart(prev => prev.filter(i => i.id !== itemId)); }, []);
  const updateCartItem = useCallback((itemId: string, updates: Partial<OrderItem>) => { setCart(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i)); }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => {
      const additionsTotal = item.additions?.reduce((acc, add) => acc + add.price, 0) || 0;
      return sum + (item.unitPrice + additionsTotal) * item.quantity;
    }, 0);
  }, [cart]);


  // =========================================================
  // 4. MUTAÇÕES (ENVIAR E ATUALIZAR NO BANCO DE DADOS)
  // =========================================================

  const placeOrderMut = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    onError: (err: any) => alert(`⚠️ Falha ao enviar pedido!\n\n${err.message}`)
  });

  const placeOrder = useCallback((paymentMethod: PaymentMethod, customerNotes: string, deliveryFee: number, changeFor?: number) => {
    if (!orderType) throw new Error("Tipo de pedido não definido");
    
    const subtotal = getCartTotal();
    const tempId = generateId(); 
    
    const order: Order = {
      id: tempId,
      number: nextOrderNumber, 
      orderType,
      tableNumber: tableNumber || undefined,
      deliveryAddress: deliveryAddress || undefined,
      customerName: customer?.name || undefined,
      customerPhone: customer?.phone || undefined,
      items: [...cart],
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      changeFor,
      customerNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCart([]); // Esvazia o carrinho localmente rápido para o utilizador
    placeOrderMut.mutate(order); // Envia para a API

    return order; // Retornamos a order provisória caso a UI precise redirecionar de imediato
  }, [cart, nextOrderNumber, orderType, tableNumber, deliveryAddress, customer, getCartTotal]);


  // --- Otimismo Extremo: Atualiza a tela primeiro, se der erro desfaz! ---
  
  const updateOrderStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => api.updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previous = queryClient.getQueryData<Order[]>(['orders']);
      queryClient.setQueryData(['orders'], (old: Order[] = []) => 
        old.map(o => o.id === id ? { ...o, status, updatedAt: new Date() } : o)
      );
      return { previous };
    },
    onError: (err: any, _, context) => {
      queryClient.setQueryData(['orders'], context?.previous); // Reverte se der erro
      alert(`⚠️ Falha ao atualizar pedido:\n${err.message}`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  });
  const updateOrderStatus = (id: string, status: OrderStatus) => updateOrderStatusMut.mutate({ id, status });

  const updatePaymentStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string, status: PaymentStatus }) => api.updatePaymentStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previous = queryClient.getQueryData<Order[]>(['orders']);
      queryClient.setQueryData(['orders'], (old: Order[] = []) => 
        old.map(o => o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date() } : o)
      );
      return { previous };
    },
    onError: (err: any, _, context) => {
      queryClient.setQueryData(['orders'], context?.previous);
      alert(`⚠️ Falha ao confirmar pagamento:\n${err.message}`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  });
  const updatePaymentStatus = (id: string, status: PaymentStatus) => updatePaymentStatusMut.mutate({ id, status });

  const rateOrderMut = useMutation({
    mutationFn: ({ id, ratings, feedback }: { id: string, ratings: Record<string, number>, feedback: string }) => api.rateOrder(id, { aspects: ratings, feedback }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    onError: (err: any) => alert(`⚠️ Falha ao enviar avaliação:\n${err.message}`)
  });
  const rateOrder = (id: string, ratings: Record<string, number>, feedback: string) => rateOrderMut.mutate({ id, ratings, feedback });


  // =========================================================
  // 5. MUTAÇÕES DE ADMINISTRAÇÃO (PRODUTOS, BANNERS E CONFIGS)
  // =========================================================

  const addProductMut = useMutation({ mutationFn: api.createProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const addProduct = (p: Omit<Product, 'id'>) => addProductMut.mutate(p);

  const updateProductMut = useMutation({ mutationFn: ({ id, updates }: { id: string, updates: Partial<Product> }) => api.updateProduct(id, updates), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const updateProduct = (id: string, updates: Partial<Product>) => updateProductMut.mutate({ id, updates });

  const deleteProductMut = useMutation({ mutationFn: api.deleteProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const deleteProduct = (id: string) => deleteProductMut.mutate(id);

  const updateSettingsMut = useMutation({ mutationFn: api.updateSettings, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const updateSettings = (s: Partial<StoreSettings>) => updateSettingsMut.mutate(s);

  const addPromoBannerMut = useMutation({ mutationFn: api.createBanner, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const addPromoBanner = (b: Omit<PromoBanner, 'id'>) => addPromoBannerMut.mutate(b);

  const updatePromoBannerMut = useMutation({ mutationFn: ({ id, updates }: { id: string, updates: Partial<PromoBanner> }) => api.updateBanner(id, updates), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const updatePromoBanner = (id: string, updates: Partial<PromoBanner>) => updatePromoBannerMut.mutate({ id, updates });

  const removePromoBannerMut = useMutation({ mutationFn: api.deleteBanner, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }), onError: (err: any) => alert(`Erro:\n${err.message}`) });
  const removePromoBanner = (id: string) => removePromoBannerMut.mutate(id);


  // =========================================================
  // 6. ESTATÍSTICAS E DERIVAÇÕES LÓGICAS
  // =========================================================

  const getTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    return orders.filter(o => new Date(o.createdAt).toDateString() === today);
  }, [orders]);

  const getTodayRevenue = useCallback(() => {
    return getTodayOrders()
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
  }, [getTodayOrders]);

  const getPopularProducts = useCallback(() => {
    const counts = new Map<string, number>();
    orders.forEach(o => o.items.forEach(item => {
      counts.set(item.product.id, (counts.get(item.product.id) || 0) + item.quantity);
    }));
    return Array.from(counts.entries())
      .map(([id, count]) => ({ product: products.find(p => p.id === id)!, count }))
      .filter(x => x.product)
      .sort((a, b) => b.count - a.count);
  }, [orders, products]);

  return (
    <StoreContext.Provider value={{
      products, orders, cart, nextOrderNumber, settings, promoBanners, 
      orderType, tableNumber, deliveryAddress, customer,
      setOrderType, setTableNumber, setDeliveryAddress, setCustomer,
      addToCart, removeFromCart, updateCartItem, clearCart,
      placeOrder, updateOrderStatus, updatePaymentStatus, rateOrder,
      addProduct, updateProduct, deleteProduct, updateSettings,
      addPromoBanner, updatePromoBanner, removePromoBanner,
      getCartTotal, getTodayOrders, getTodayRevenue, getPopularProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
};