import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// O ficheiro mágico que centraliza as rotas todas
import apiRoutes from './routes/index.js'; 

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
  allowedHeaders: ['Content-Type', 'x-admin-token'], // Permite que o React Query envie o token!
  credentials: true 
};

// ATENÇÃO: Estes dois devem vir sempre ANTES de qualquer rota!
app.use(cors(corsOptions));
app.use(express.json());

// =========================================================
// --- ROTAS DE HEALTH CHECK (Estado do Sistema) ---
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
// --- INJEÇÃO DE ROTAS MODULARES ---
// =========================================================

// Todas as requisições que começam com '/api' são passadas para o nosso router central
app.use('/api', apiRoutes);

// =========================================================
// --- INICIAR O SERVIDOR ---
// =========================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor a rodar na porta http://localhost:${PORT}`);
  console.log(`🛡️ Arquitetura Modular Ativa (Controllers + Routes)`);
});