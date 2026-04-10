import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
  }
};

// 👇 NOVA FUNÇÃO ADICIONADA AQUI: Resolve o erro /api/orders/today 👇
export const getTodayOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos de hoje', details: error.message });
  }
};
// 👆 FIM DA NOVA FUNÇÃO 👆

export const createOrder = async (req, res) => {
  try {
    const data = req.body;
    const newOrder = await prisma.order.create({
      data: {
        orderType: data.orderType,
        tableNumber: data.tableNumber,
        deliveryAddress: data.deliveryAddress,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending', 
        changeFor: data.changeFor,
        customerNotes: data.customerNotes,
        customerName: data.customerName || 'Cliente Anônimo',
        customerPhone: data.customerPhone || 'Não informado',
        items: data.items, 
      }
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao criar pedido', details: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await prisma.order.update({ where: { id }, data: { status } });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const updatedOrder = await prisma.order.update({ where: { id }, data: { paymentStatus } });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao confirmar pagamento', details: error.message });
  }
};

export const rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const updatedOrder = await prisma.order.update({ where: { id }, data: { rating } });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao guardar avaliação', details: error.message });
  }
};
