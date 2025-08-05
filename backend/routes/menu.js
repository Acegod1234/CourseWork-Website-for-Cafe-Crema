import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getMenu, 
  getMenuByCategory, 
  getMenuByType, 
  getMenuItem, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  getMenuCategories, 
  getBestsellers,
  clearCache
} from '../controllers/menuController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'backend', 'uploads', 'menu'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const upload = multer({ storage });

// Public routes
router.get('/', getMenu);
router.get('/categories', getMenuCategories);
router.get('/bestsellers', getBestsellers);
router.get('/category/:category', getMenuByCategory);
router.get('/type/:type', getMenuByType);
router.get('/item/:id', getMenuItem);

// Admin-only routes
router.post('/', requireAuth, requireAdmin, upload.single('image'), createMenuItem);
router.put('/item/:id', requireAuth, requireAdmin, upload.single('image'), updateMenuItem);
router.delete('/item/:id', requireAuth, requireAdmin, deleteMenuItem);
router.post('/clear-cache', requireAuth, requireAdmin, clearCache);

export default router; 