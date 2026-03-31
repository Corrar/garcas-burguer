// Ficheiro: src/services/api.ts

import type { Product, Order, OrderStatus, PaymentStatus } from '@/types';

// A URL mágica que aponta para o teu servidor
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Objeto que agrupa todas as chamadas ao servidor
export const api = {
  
  // ==========================================
  // PRODUTOS
  // ==========================================
  
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    return response.json();
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Erro ao criar produto no servidor');
    return response.json();
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Erro ao atualizar produto');
    return response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao apagar produto');
  },

  // ==========================================
  // PEDIDOS
  // ==========================================
  
  getTodayOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders/today`);
    if (!response.ok) throw new Error('Erro ao buscar pedidos');
    return response.json();
  },

  createOrder: async (order: Order): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error('Erro ao salvar pedido na API');
    return response.json();
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do pedido');
  },

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus): Promise<void> => {
    const response = await fetch(`${API_URL}/orders/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus })
    });
    if (!response.ok) throw new Error('Erro ao atualizar status de pagamento');
  }
};