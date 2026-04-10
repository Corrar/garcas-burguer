import express from 'express';

// Importar as rotas separadas
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// =========================================================
// Mapeamento das Rotas
// =========================================================

// Vai mapear para /api/products/...
router.use('/products', productRoutes);

// Vai mapear para /api/orders/...
router.use('/orders', orderRoutes);

// Como o adminRoutes tem "/settings" e "/banners" lá dentro, mapeamos na raiz
router.use('/', adminRoutes);

export default router;