import express from 'express';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { 
  getOrders, 
  createOrder, 
  updateOrderStatus, 
  updatePaymentStatus, 
  rateOrder 
} from '../controllers/orderController.js';

const router = express.Router();

// O prefixo '/orders' será adicionado no index.js
router.get('/', getOrders);
router.post('/', createOrder);

// Rotas protegidas (Apenas Admin)
router.patch('/:id/status', protectAdmin, updateOrderStatus);
router.patch('/:id/payment', protectAdmin, updatePaymentStatus);

// Rota pública (Clientes avaliam)
router.patch('/:id/rating', rateOrder);

export default router;