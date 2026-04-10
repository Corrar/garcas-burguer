import express from 'express';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// O prefixo '/products' será adicionado no index.js
router.get('/', getProducts);
router.post('/', protectAdmin, createProduct);
router.patch('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;