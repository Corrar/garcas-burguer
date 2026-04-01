import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// =========================================================
// --- CONFIGURAÇÃO DE SEGURANÇA CORS (CORRIGIDA) ---
// =========================================================
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://garca-burguer.vercel.app' // 👈 O TEU LINK DA VERCEL
  ], 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
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
    res.status(500).json({ status: 'error', message: 'Falha ao ligar à Base de Dados.' });
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
    res.status(500).json({ error: 'Erro ao procurar produtos' });
  }
});

// 1. Criar um NOVO produto (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image || '',
        popular: data.popular || false,
        customizations: data.customizations || [],
        active: true 
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: 'Erro interno ao criar produto' });
  }
});

// 2. Atualizar um produto existente (Admin)
app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: data
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
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
    res.status(500).json({ error: 'Erro ao apagar produto' });
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
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
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
    res.status(500).json({ error: 'Erro interno ao criar pedido' });
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
    res.status(500).json({ error: 'Erro ao atualizar status' });
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
    res.status(500).json({ error: 'Erro ao confirmar pagamento' });
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
    res.status(500).json({ error: 'Erro ao buscar banners' });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const newBanner = await prisma.promoBanner.create({
      data: req.body
    });
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar banner' });
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
    res.status(500).json({ error: 'Erro ao atualizar banner' });
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
    res.status(500).json({ error: 'Erro ao apagar banner' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a rodar na porta http://localhost:${PORT}`);
});
