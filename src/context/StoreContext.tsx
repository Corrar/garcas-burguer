import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { 
  Product, 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  StoreSettings, 
  PromoBanner, 
  OrderType, 
  OrderRating 
} from '@/types';

// A URL mágica que aponta para o teu servidor (Lê do ficheiro .env que criaste)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Gerador de ID para o Carrinho (local)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
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
  
  // =========================================================
  // 1. ESTADOS QUE VÊM DO SERVIDOR (NEON DB)
  // =========================================================
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    isOpen: true,
    deliveryFee: 5.99,
    estimatedDeliveryTime: '30-40 min',
    minimumOrderValue: 0
  });
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);

  // =========================================================
  // 2. ESTADOS LOCAIS DO CLIENTE (MANTÉM NO LOCALSTORAGE)
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

  // O número do pedido agora é calculado com base na API
  const nextOrderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.number)) + 1 : 1;

  // =========================================================
  // 3. BUSCAR DADOS DO BACKEND (AO INICIAR A APP)
  // =========================================================
  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      try {
        // CORREÇÃO: Buscamos Produtos, Pedidos E Configurações
        const [prodRes, ordRes, setRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/settings`)
        ]);
        
        if (prodRes.ok) setProducts(await prodRes.json());
        
        if (ordRes.ok) {
          const fetchedOrders = await ordRes.json();
          setOrders(fetchedOrders.map((o: any) => ({ 
            ...o, 
            createdAt: new Date(o.createdAt), 
            updatedAt: new Date(o.updatedAt) 
          })));
        }

        // CORREÇÃO: Atualiza as configurações da loja caso o servidor responda
        if (setRes.ok) {
          const fetchedSettings = await setRes.json();
          if (fetchedSettings) setSettings(fetchedSettings);
        }
      } catch (error) {
        console.error("Falha ao ligar ao servidor API:", error);
      }
    };
    carregarDadosDoBanco();
  }, []);

  // --- Salvar dados locais do cliente no telemóvel dele ---
  useEffect(() => { localStorage.setItem('@burger-buddy:cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (orderType) localStorage.setItem('@burger-buddy:orderType', orderType); }, [orderType]);
  useEffect(() => { if (tableNumber) localStorage.setItem('@burger-buddy:tableNumber', tableNumber); }, [tableNumber]);
  useEffect(() => { if (deliveryAddress) localStorage.setItem('@burger-buddy:deliveryAddress', deliveryAddress); }, [deliveryAddress]);
  useEffect(() => { if (customer) localStorage.setItem('@burger-buddy:customer', JSON.stringify(customer)); }, [customer]);


  // =========================================================
  // 4. FUNÇÕES DO CARRINHO (NÃO MEXEM NA BASE DE DADOS AINDA)
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
  // 5. ENVIAR E ATUALIZAR PEDIDOS NA BASE DE DADOS
  // =========================================================
  const placeOrder = useCallback((paymentMethod: PaymentMethod, customerNotes: string, deliveryFee: number, changeFor?: number) => {
    if (!orderType) throw new Error("Tipo de pedido não definido");
    
    const subtotal = getCartTotal();
    const tempId = generateId(); // CORREÇÃO: Guardamos o ID provisório
    
    const order: Order = {
      id: tempId,
      number: nextOrderNumber, // Provisório
      orderType,
      tableNumber: tableNumber || undefined,
      deliveryAddress: deliveryAddress || undefined,
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

    // 1. Atualiza o ecrã instantaneamente com o pedido provisório
    setOrders(prev => [order, ...prev]);
    setCart([]);

    // 2. Dispara o salvamento no Servidor
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(savedOrder => {
      // CORREÇÃO: Substituímos o pedido temporário pelo pedido oficial com o ID gerado pela base de dados
      setOrders(prev => prev.map(o => o.id === tempId ? {
        ...savedOrder, 
        createdAt: new Date(savedOrder.createdAt), 
        updatedAt: new Date(savedOrder.updatedAt)
      } : o));
    })
    .catch(err => console.error("Erro ao salvar pedido na API:", err));

    return order;
  }, [cart, nextOrderNumber, orderType, tableNumber, deliveryAddress, getCartTotal]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    // 1. Atualiza ecrã
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o));
    // 2. Atualiza Servidor
    fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.error(err));
  }, []);

  const updatePaymentStatus = useCallback((orderId: string, paymentStatus: PaymentStatus) => {
    // 1. Atualiza ecrã
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus, updatedAt: new Date() } : o));
    // 2. Atualiza Servidor
    fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus })
    }).catch(err => console.error(err));
  }, []);

  const rateOrder = useCallback((orderId: string, ratings: Record<string, number>, feedback: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      rating: { aspects: ratings, feedback, createdAt: new Date().toISOString() }
    } : o));
  }, []);


  // =========================================================
  // 6. ADMINISTRAÇÃO E ESTATÍSTICAS
  // =========================================================
  
  const addProduct = useCallback((product: Omit<Product, 'id'>) => { 
    // 1. Atualiza o ecrã instantaneamente (Gera um ID provisório)
    const tempId = generateId();
    const newProduct = { ...product, id: tempId };
    setProducts(prev => [...prev, newProduct]); 

    // 2. Envia para o servidor para guardar na base de dados
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(savedProduct => {
      // Quando o servidor responde, substituímos o ID provisório pelo ID real gerado pelo banco de dados
      setProducts(prev => prev.map(p => p.id === tempId ? savedProduct : p));
    })
    .catch(err => console.error("Erro ao salvar produto no servidor:", err));
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => { 
    // 1. Atualiza o ecrã instantaneamente
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)); 
    
    // 2. Atualiza no servidor
    fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.error("Erro ao atualizar produto no servidor:", err));
  }, []);

  const deleteProduct = useCallback((id: string) => { 
    // 1. Remove do ecrã instantaneamente
    setProducts(prev => prev.filter(p => p.id !== id)); 
    
    // 2. Apaga no servidor
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error("Erro ao apagar produto no servidor:", err));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => { setSettings(prev => ({ ...prev, ...newSettings })); }, []);

  const getTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    return orders.filter(o => o.createdAt.toDateString() === today);
  }, [orders]);

  const getTodayRevenue = useCallback(() => {
    return getTodayOrders()
      .filter(o => o.paymentStatus === 'paid') // Só conta dinheiro que realmente entrou
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
      addPromoBanner: (b) => setPromoBanners(prev => [...prev, { ...b, id: generateId() }]),
      updatePromoBanner: (id, u) => setPromoBanners(prev => prev.map(b => b.id === id ? { ...b, ...u } : b)),
      removePromoBanner: (id) => setPromoBanners(prev => prev.filter(b => b.id !== id)),
      getCartTotal, getTodayOrders, getTodayRevenue, getPopularProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
