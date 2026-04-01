import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

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
  allowedHeaders: ['Content-Type'], 
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

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { active: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar produtos', details: error.message });
  }
});

// 1. Criar um NOVO produto (BLINDADO)
app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name: String(data.name || 'Produto Sem Nome'),
        description: String(data.description || ''),
        // Força a conversão do preço para número, quer venha como texto ou vazio
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
    // O detalhe do erro agora é enviado de volta ao frontend!
    res.status(500).json({ error: 'Erro interno ao criar produto', details: error.message });
  }
});

// 2. Atualizar um produto existente (BLINDADO)
app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Filtramos apenas o que vem no pedido para atualizar e forçamos o tipo correto
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

// 3. Apagar um produto (Admin)
app.delete('/api/products/:id', async (req, res) => {
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
// --- ROTAS DE PEDIDOS E CONFIGURAÇÕES ---
// =========================================================

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações', details: error.message });
  }
});

// Criar um NOVO pedido (Vem do telemóvel do cliente)
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
        paymentStatus: 'pending', // Nasce sempre pendente
        changeFor: data.changeFor,
        customerNotes: data.customerNotes,
        customerName: data.customerName || 'Cliente Anônimo',
        customerPhone: data.customerPhone || 'Não informado',
        items: data.items, // Guardamos o carrinho em JSON
      }
    });
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: 'Erro interno ao criar pedido', details: error.message });
  }
});

// Atualizar o Status do Pedido (Cozinha: "Preparando", "Pronto")
app.patch('/api/orders/:id/status', async (req, res) => {
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

// Atualizar o Status do Pagamento (Admin: "Pago")
app.patch('/api/orders/:id/payment', async (req, res) => {
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

app.get('/api/banners', async (req, res) => {
  try {
    const banners = await prisma.promoBanner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar banners', details: error.message });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const newBanner = await prisma.promoBanner.create({
      data: req.body
    });
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar banner', details: error.message });
  }
});

app.patch('/api/banners/:id', async (req, res) => {
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

app.delete('/api/banners/:id', async (req, res) => {
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
