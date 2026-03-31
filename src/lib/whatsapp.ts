import type { Order } from '@/types';
import { PAYMENT_LABELS } from '@/types';

export const formatOrderForWhatsApp = (order: Order): string => {
  const header = `🍔 *Garça's Burguer - Pedido #${order.number}*`;
  const separator = '━━━━━━━━━━━━━━━━━━';
  
  const items = order.items.map(item => {
    const additionsTotal = item.additions?.reduce((acc, add) => acc + add.price, 0) || 0;
    const itemTotal = (item.unitPrice + additionsTotal) * item.quantity;
    let line = `▸ ${item.quantity}x ${item.product.name} — R$ ${itemTotal.toFixed(2)}`;
    if (item.removals && item.removals.length > 0) {
      line += `\n   Sem: _${item.removals.join(', ')}_`;
    }
    if (item.additions && item.additions.length > 0) {
      line += `\n   Extra: _${item.additions.map(a => a.name).join(', ')}_`;
    }
    return line;
  }).join('\n');

  const payment = `💳 *Pagamento:* ${PAYMENT_LABELS[order.paymentMethod]}`;
  const changeInfo = order.changeFor ? `\n💵 *Troco para:* R$ ${order.changeFor.toFixed(2)}` : '';
  const subtotal = `🛒 *Subtotal:* R$ ${order.subtotal?.toFixed(2) || (order.total - order.deliveryFee).toFixed(2)}`;
  const delivery = `🛵 *Taxa de Entrega:* ${order.deliveryFee === 0 ? 'Grátis' : `R$ ${order.deliveryFee?.toFixed(2)}`}`;
  const total = `💰 *Total: R$ ${order.total.toFixed(2)}*`;
  const time = `🕐 ${order.createdAt.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  const notes = order.customerNotes ? `\n📝 _${order.customerNotes}_` : '';

  return `${header}\n${separator}\n\n${items}\n\n${separator}\n${subtotal}\n${delivery}\n${total}\n\n${payment}${changeInfo}\n${time}${notes}\n\n_Obrigado pela preferência! 🔥_`;
};

export const openWhatsApp = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
};

export const shareWhatsAppNoPhone = (message: string) => {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
};
