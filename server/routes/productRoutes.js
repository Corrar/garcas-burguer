// Ficheiro: server/routes/productRoutes.js

import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

// 1. O nosso Segurança (Token)
import { protectAdmin } from '../middlewares/authMiddleware.js';

// 2. A nossa Alfândega (Zod)
import { validateData } from '../middlewares/validateMiddleware.js';
import { productSchema } from '../validators/productValidator.js';

const router = express.Router();

// LER: Público (Qualquer cliente pode ver o cardápio)
router.get('/', getProducts);

// CRIAR: Requer Token -> PASSA NA ALFÂNDEGA -> Cria Produto
router.post('/', protectAdmin, validateData(productSchema), createProduct);

// ATUALIZAR: Usamos o .partial() porque o admin pode querer atualizar SÓ o preço, sem enviar o resto
router.patch('/:id', protectAdmin, validateData(productSchema.partial()), updateProduct);

// APAGAR: Não precisa de validar dados do corpo, apenas do Token
router.delete('/:id', protectAdmin, deleteProduct);

export default router;