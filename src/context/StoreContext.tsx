import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product, Order, OrderItem, OrderStatus, PaymentMethod, StoreSettings, PromoBanner, OrderType } from '@/types';
import { defaultProducts } from '@/data/products';

interface StoreState {
  products: Product[];
  orders: Order[];
  cart: OrderItem[];
  nextOrderNumber: number;
  settings: StoreSettings;
  promoBanners: PromoBanner[];
  orderType: OrderType | null;
  tableNumber: string | null;
}

interface StoreContextType extends StoreState {
  setOrderType: (type: OrderType | null) => void;
  setTableNumber: (table: string | null) => void;
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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('@burger-buddy:products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('@burger-buddy:settings');
      return saved ? JSON.parse(saved) : {
        isOpen: true,
        deliveryFee: 5.99,
        estimatedDeliveryTime: '30-40 min',
        minimumOrderValue: 0
      };
    } catch {
      return {
        isOpen: true,
        deliveryFee: 5.99,
        estimatedDeliveryTime: '30-40 min',
        minimumOrderValue: 0
      };
    }
  });

  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(() => {
    try {
      const saved = localStorage.getItem('@burger-buddy:banners');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Black Friday: 50% OFF em Combos', imageUrl: '', active: true },
        { id: '2', title: 'Frete Grátis (Acima de R$50)', imageUrl: '', active: true },
        { id: '3', title: 'Lançamento: Smash Duplo com Bacon', imageUrl: '', active: true }
      ];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('@burger-buddy:cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType | null>(() => {
    try {
      return localStorage.getItem('@burger-buddy:orderType') as OrderType | null;
    } catch {
      return null;
    }
  });

  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    try {
      return localStorage.getItem('@burger-buddy:tableNumber');
    } catch {
      return null;
    }
  });

  const [nextOrderNumber, setNextOrderNumber] = useState(1);

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem('@burger-buddy:cart');
    } else {
      localStorage.setItem('@burger-buddy:cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('@burger-buddy:products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('@burger-buddy:settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('@burger-buddy:banners', JSON.stringify(promoBanners));
  }, [promoBanners]);

  useEffect(() => {
    if (orderType) localStorage.setItem('@burger-buddy:orderType', orderType);
    else localStorage.removeItem('@burger-buddy:orderType');
  }, [orderType]);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('@burger-buddy:tableNumber', tableNumber);
    else localStorage.removeItem('@burger-buddy:tableNumber');
  }, [tableNumber]);

  const addToCart = useCallback((product: Product, removals: string[] = [], additions: { name: string; price: number }[] = [], notes = '') => {
    const item: OrderItem = {
      id: crypto.randomUUID(),
      product,
      quantity: 1,
      removals,
      additions,
      notes,
      unitPrice: product.price,
    };
    setCart(prev => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateCartItem = useCallback((itemId: string, updates: Partial<OrderItem>) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => {
      const additionsTotal = item.additions?.reduce((acc, add) => acc + add.price, 0) || 0;
      return sum + (item.unitPrice + additionsTotal) * item.quantity;
    }, 0);
  }, [cart]);

  const placeOrder = useCallback((paymentMethod: PaymentMethod, customerNotes: string, deliveryFee: number, changeFor?: number) => {
    if (!orderType) throw new Error("OrderType is required");
    
    const subtotal = getCartTotal();
    const orderTotal = subtotal + deliveryFee;
    const order: Order = {
      id: crypto.randomUUID(),
      number: nextOrderNumber,
      orderType,
      tableNumber: tableNumber || undefined,
      items: [...cart],
      subtotal,
      deliveryFee,
      total: orderTotal,
      status: 'pending',
      paymentMethod,
      changeFor,
      customerNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOrders(prev => [order, ...prev]);
    setNextOrderNumber(prev => prev + 1);
    setCart([]);
    return order;
  }, [cart, nextOrderNumber, orderType, tableNumber]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: crypto.randomUUID() }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addPromoBanner = useCallback((banner: Omit<PromoBanner, 'id'>) => {
    setPromoBanners(prev => [...prev, { ...banner, id: crypto.randomUUID() }]);
  }, []);

  const updatePromoBanner = useCallback((id: string, updates: Partial<PromoBanner>) => {
    setPromoBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const removePromoBanner = useCallback((id: string) => {
    setPromoBanners(prev => prev.filter(b => b.id !== id));
  }, []);

  const getTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    return orders.filter(o => o.createdAt.toDateString() === today);
  }, [orders]);

  const getTodayRevenue = useCallback(() => {
    return getTodayOrders().reduce((sum, o) => sum + o.total, 0);
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
      products, orders, cart, nextOrderNumber, settings, promoBanners, orderType, tableNumber,
      setOrderType, setTableNumber,
      addToCart, removeFromCart, updateCartItem, clearCart,
      placeOrder, updateOrderStatus,
      addProduct, updateProduct, deleteProduct,
      updateSettings, addPromoBanner, updatePromoBanner, removePromoBanner,
      getCartTotal, getTodayOrders, getTodayRevenue, getPopularProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
