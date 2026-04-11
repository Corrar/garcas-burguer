// Ficheiro: src/services/api.ts

import type { Product, Order, OrderStatus, PaymentStatus, StoreSettings, PromoBanner } from '@/types';

// A URL mágica que aponta para o teu servidor
const API_URL = import.meta.env.VITE_API_URL || 'https://burguer-api-avqk.onrender.com/api';

// ============================================================================
// 🛡️ INTERCEPTOR E WRAPPER DE FETCH (O CORAÇÃO DA COMUNICAÇÃO)
// ============================================================================

// Pega APENAS a senha que tu digitaste no ecrã discreto
const getAdminToken = () => {
  return localStorage.getItem('@burger-buddy:adminToken') || '';
};

// Função centralizadora. Lida com JSON, Tokens e Erros de forma automática!
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-token': getAdminToken(), // Injetado sempre, o backend ignora se não precisar
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    
    // 👇 A GRANDE JOGADA: Se a senha estiver errada, o servidor manda 401!
    if (response.status === 401) {
      localStorage.removeItem('@burger-buddy:adminToken'); // Apaga a senha falsa
      window.dispatchEvent(new Event('admin-logout')); // Acorda o ecrã do cadeado
      throw new Error('Senha incorreta! O acesso foi bloqueado.');
    }

    // Prevenção para respostas vazias (ex: DELETE 204 No Content)
    if (response.status === 204) return null;

    // Tenta fazer parse do JSON (se não der, retorna null)
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Puxa a mensagem de erro detalhada que enviamos do backend do Prisma
      const errorMessage = data?.details || data?.error || `Erro HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error(`🚨 Erro na API [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error; // Lança o erro para que a interface (React) mostre um toast ao usuário
  }
};

// ============================================================================
// 📦 ENDPOINTS DA API CENTRALIZADOS
// ============================================================================

export const api = {
  
  // --- PRODUTOS ---
  getProducts: (): Promise<Product[]> => fetchAPI('/products'),
  
  createProduct: (product: Omit<Product, 'id'>): Promise<Product> => 
    fetchAPI('/products', { method: 'POST', body: JSON.stringify(product) }),
  
  updateProduct: (id: string, updates: Partial<Product>): Promise<Product> => 
    fetchAPI(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  
  deleteProduct: (id: string): Promise<void> => 
    fetchAPI(`/products/${id}`, { method: 'DELETE' }),


  // --- PEDIDOS ---
  getOrders: (): Promise<Order[]> => fetchAPI('/orders'),
  
  createOrder: (order: Order): Promise<Order> => 
    fetchAPI('/orders', { method: 'POST', body: JSON.stringify(order) }),
  
  updateOrderStatus: (id: string, status: OrderStatus): Promise<Order> => 
    fetchAPI(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus): Promise<Order> => 
    fetchAPI(`/orders/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }),
  
  rateOrder: (id: string, rating: Record<string, any>): Promise<Order> => 
    fetchAPI(`/orders/${id}/rating`, { method: 'PATCH', body: JSON.stringify({ rating }) }),


  // --- CONFIGURAÇÕES DA LOJA ---
  getSettings: (): Promise<StoreSettings> => fetchAPI('/settings'),
  
  updateSettings: (settings: Partial<StoreSettings>): Promise<StoreSettings> => 
    fetchAPI('/settings', { method: 'PATCH', body: JSON.stringify(settings) }),


  // --- BANNERS PROMOCIONAIS ---
  getBanners: (): Promise<PromoBanner[]> => fetchAPI('/banners'),
  
  createBanner: (banner: Omit<PromoBanner, 'id'>): Promise<PromoBanner> => 
    fetchAPI('/banners', { method: 'POST', body: JSON.stringify(banner) }),
  
  updateBanner: (id: string, updates: Partial<PromoBanner>): Promise<PromoBanner> => 
    fetchAPI(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  
  deleteBanner: (id: string): Promise<void> => 
    fetchAPI(`/banners/${id}`, { method: 'DELETE' })

};
