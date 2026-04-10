import express from 'express';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { 
  getSettings, 
  updateSettings, 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner 
} from '../controllers/adminController.js';

const router = express.Router();

// ==========================================
// --- CONFIGURAÇÕES DA LOJA (/settings) ---
// ==========================================
router.get('/settings', getSettings);
router.patch('/settings', protectAdmin, updateSettings);

// ==========================================
// --- BANNERS PROMOCIONAIS (/banners) ---
// ==========================================
router.get('/banners', getBanners);
router.post('/banners', protectAdmin, createBanner);
router.patch('/banners/:id', protectAdmin, updateBanner);
router.delete('/banners/:id', protectAdmin, deleteBanner);

export default router;