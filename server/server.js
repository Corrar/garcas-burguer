import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
// IMPORTAÇÃO DO NOSSO SEGURANÇA
import { protectAdmin } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// =========================================================
// --- CONFIGURAÇÃO DE SEGURANÇA CORS (UNIVERSAL) ---
// =========================================================
const corsOptions = {
  origin: function (origin, callback) {
    // Aceita qualquer origem (Vercel, localhost, etc) para evitar bloqueios silenciosos
    callback(null, true); 
  }, 
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'x-admin-token'], // Adicionamos o cabeçalho do token aqui!
  credentials: true 
};

// ATENÇÃO: Estes dois devem vir sempre ANTES de qualquer rota!
app.use(cors(corsOptions));
app.use(express.json());

// =========================================================
// --- ROTAS DE LEITURA (GET) ---
// =========================================================

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: '🍔 Servidor ON e ligado ao NeonDB!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Falha ao ligar à Base de Dados.', details: error.message });
  }
});

// =========================================================
// --- ROTAS DE PRODUTOS ---
// =========================================================

// LER: Público (Qualquer pessoa pode ver)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { active: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar produtos', details: error.message });
  }
});

// 1. Criar um NOVO produto (BLINDADO - Requer Admin)
app.post('/api/products', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name: String(data.name || 'Produto Sem Nome'),
        description: String(data.description || ''),
        price: Number(data.price) || 0,
        category: String(data.category || 'burgers'),
        image: String(data.image || ''),
        popular: Boolean(data.popular),
        customizations: Array.isArray(data.customizations) ? data.customizations : [],
        active: true 
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🔥 ERRO FATAL AO CRIAR PRODUTO:", error);
    res.status(500).json({ error: 'Erro interno ao criar produto', details: error.message });
  }
});

// 2. Atualizar um produto existente (BLINDADO - Requer Admin)
app.patch('/api/products/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updateData = {};
    if (data.name !== undefined) updateData.name = String(data.name);
    if (data.description !== undefined) updateData.description = String(data.description);
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.category !== undefined) updateData.category = String(data.category);
    if (data.image !== undefined) updateData.image = String(data.image);
    if (data.popular !== undefined) updateData.popular = Boolean(data.popular);
    if (data.customizations !== undefined) updateData.customizations = Array.isArray(data.customizations) ? data.customizations : [];

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updateData
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("🔥 ERRO FATAL AO ATUALIZAR PRODUTO:", error);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

// 3. Apagar um produto (BLINDADO - Requer Admin)
app.delete('/api/products/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: id }
    });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar produto', details: error.message });
  }
});

// =========================================================
// --- ROTAS DE CONFIGURAÇÕES DA LOJA ---
// =========================================================

// LER: Público (Para a app saber se está aberta/fechada)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações', details: error.message });
  }
});

// ATUALIZAR: (BLINDADO - Requer Admin)
app.patch('/api/settings', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    
    // Atualiza ou cria se não existir (upsert)
    const updatedSettings = await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: {
        isOpen: data.isOpen,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        deliveryFee: data.deliveryFee !== undefined ? Number(data.deliveryFee) : undefined,
        minimumOrderValue: data.minimumOrderValue !== undefined ? Number(data.minimumOrderValue) : undefined
      },
      create: {
        id: 'singleton',
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        estimatedDeliveryTime: data.estimatedDeliveryTime || '30-40 min',
        deliveryFee: Number(data.deliveryFee) || 5.99,
        minimumOrderValue: Number(data.minimumOrderValue) || 0
      }
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    res.status(500).json({ error: 'Erro ao atualizar configurações', details: error.message });
  }
});

// =========================================================
// --- ROTAS DE PEDIDOS ---
// =========================================================

// LER Pedidos (Idealmente seria protegido para o Admin/Cozinha, mas mantemos aberto se já estava assim no teu design)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
  }
});

// CRIAR um NOVO pedido (Público - Clientes enviam pedidos sem token)
app.post('/api/orders', async (req, res) => {
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
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: 'Erro interno ao criar pedido', details: error.message });
  }
});

// Atualizar Status do Pedido (BLINDADO - Requer Admin)
app.patch('/api/orders/:id/status', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
  }
});

// Atualizar Status de Pagamento (BLINDADO - Requer Admin)
app.patch('/api/orders/:id/payment', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { paymentStatus }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao confirmar pagamento', details: error.message });
  }
});

// =========================================================
// --- ROTAS DE BANNERS PROMOCIONAIS ---
// =========================================================

// LER: Público
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await prisma.promoBanner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar banners', details: error.message });
  }
});

// CRIAR: (BLINDADO)
app.post('/api/banners', protectAdmin, async (req, res) => {
  try {
    const newBanner = await prisma.promoBanner.create({
      data: req.body
    });
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar banner', details: error.message });
  }
});

// ATUALIZAR: (BLINDADO)
app.patch('/api/banners/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBanner = await prisma.promoBanner.update({
      where: { id },
      data: req.body
    });
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar banner', details: error.message });
  }
});

// APAGAR: (BLINDADO)
app.delete('/api/banners/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promoBanner.delete({
      where: { id }
    });
    res.json({ message: 'Banner removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar banner', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a rodar na porta http://localhost:${PORT}`);
});
